import { Insights } from './types';
import { ANALYSIS_SYSTEM_PROMPT, buildAnalysisUserPrompt } from './prompts';

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = 'https://api.minimax.io/v1';

export async function analyzeJournal(transcript: string): Promise<Insights> {
  try {
    if (!MINIMAX_API_KEY) {
      console.warn('MINIMAX_API_KEY not set, using fallback insights');
      return getFallbackInsights();
    }

    const response = await fetch(
      `${MINIMAX_BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MINIMAX_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'MiniMax-M2.1',
          messages: [
            { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
            { role: 'user', content: buildAnalysisUserPrompt(transcript) },
          ],
          temperature: 0.3,
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`MiniMax API error ${response.status}:`, errorText);
      throw new Error(`MiniMax API error: ${response.status}`);
    }

    const data = await response.json();

    const content =
      data.choices?.[0]?.message?.content ||
      data.reply ||
      '';

    if (!content) {
      console.error('MiniMax returned empty content. Full response:', JSON.stringify(data).slice(0, 500));
      throw new Error('Empty response from MiniMax');
    }

    // Log the raw content for debugging
    console.log('MiniMax raw content (first 300 chars):', content.slice(0, 300));

    // Extract JSON from the response
    // The model may wrap output in <think>...</think> tags followed by JSON,
    // or in markdown code fences, or return it directly
    const cleaned = extractJSON(content);
    console.log('Cleaned JSON (first 300 chars):', cleaned.slice(0, 300));

    const parsed = JSON.parse(cleaned);

    // Validate and fill defaults for any missing required fields
    const insights = validateInsights(parsed);
    return insights;
  } catch (error) {
    console.error('MiniMax analysis failed, using fallback:', error);
    return getFallbackInsights();
  }
}

/**
 * Extract JSON from model output that may contain <think> tags, markdown fences, etc.
 */
function extractJSON(raw: string): string {
  // Strategy 1: Remove <think>...</think> blocks first
  let text = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Strategy 2: If there's a markdown JSON code fence, extract from it
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  // Strategy 3: Find the first { and last } to extract the JSON object
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  // Fallback: return the cleaned text as-is
  return text;
}

/**
 * Validate parsed insights and fill in defaults for any missing fields
 * so Mongoose never gets null for required fields.
 */
function validateInsights(raw: Record<string, unknown>): Insights {
  const mood = raw.mood as Record<string, unknown> | undefined;
  const convQuality = raw.conversation_quality as Record<string, unknown> | undefined;

  return {
    mood: {
      score: toNumber(mood?.score, 5),
      label: toString(mood?.label, 'okay') as Insights['mood']['label'],
      description: toString(mood?.description, 'Reflected on the day.'),
    },
    summary: toString(raw.summary, 'Had a day worth reflecting on.'),
    themes: toStringArray(raw.themes, ['daily reflection']),
    wins: toStringArray(raw.wins, []),
    struggles: toStringArray(raw.struggles, []),
    people_mentioned: toStringArray(raw.people_mentioned, []),
    looking_forward_to: raw.looking_forward_to
      ? String(raw.looking_forward_to)
      : null,
    concern_level: toString(raw.concern_level, 'none') as Insights['concern_level'],
    conversation_quality: {
      openness: toNumber(convQuality?.openness, 3),
      duration_feel: toString(convQuality?.duration_feel, 'moderate') as 'brief' | 'moderate' | 'extended',
      engagement: toString(convQuality?.engagement, 'moderate') as 'minimal' | 'moderate' | 'high',
    },
  };
}

function toNumber(val: unknown, fallback: number): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    if (!isNaN(n)) return n;
  }
  return fallback;
}

function toString(val: unknown, fallback: string): string {
  if (typeof val === 'string' && val.length > 0) return val;
  return fallback;
}

function toStringArray(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === 'string');
  return fallback;
}

function getFallbackInsights(): Insights {
  return {
    mood: {
      score: 5,
      label: 'okay',
      description: 'Had a steady day with a mix of moments.',
    },
    summary:
      'I had an alright day today. Kept myself busy and tried to stay positive. Looking forward to tomorrow.',
    themes: ['daily routine', 'steady progress'],
    wins: ['Got through the day', 'Stayed positive'],
    struggles: [],
    people_mentioned: [],
    looking_forward_to: null,
    concern_level: 'none',
    conversation_quality: {
      openness: 3,
      duration_feel: 'moderate',
      engagement: 'moderate',
    },
  };
}
