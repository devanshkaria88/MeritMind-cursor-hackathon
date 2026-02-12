# MeritMind — Product Requirements Document

> **"Talk about your day. We'll remember the good stuff."**

**Project**: MeritMind — Voice Mood Journal for Own Merit Residents  
**Event**: Cursor × MiniMax Northampton Hackathon — "The Own Merit Challenge"  
**Build Time**: 2.5 hours (6:00 PM – 8:30 PM)  
**Theme**: Resident-Focused Solutions — web application, resident-first approach  
**Author**: Devansh  
**Date**: February 2026

---

## 1. What We're Building

A **voice-first mood journaling app** where Own Merit residents have a warm, natural conversation with an AI companion at the end of their day. They just *talk* — no typing, no forms, no friction. The AI listens, asks gentle follow-ups, and when the conversation ends, the system captures every nuance: mood, achievements, struggles, themes, and patterns.

Over time, MeritMind builds a rich picture of each resident's emotional journey — mood trends, recurring themes, progress arcs — all from natural voice conversations they actually enjoy having.

### The Insight

Most journaling apps fail for this population because:
- Many residents have **low literacy** — typing is a barrier
- End-of-day **energy is low** — filling forms feels like work
- Written journaling feels like **homework or compliance**

Voice changes everything. Talking is natural. Everyone can do it. It feels like chatting with a friend, not filing a report.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   RESIDENT'S PHONE                   │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │          Next.js Web App (Mobile UI)             │ │
│  │                                                   │ │
│  │  "Hey, how was your day?"                        │ │
│  │  [🎙️ Tap to start talking]                       │ │
│  │                                                   │ │
│  │  Real-time voice conversation                     │ │
│  │  ← ElevenLabs React SDK (@11labs/react) →        │ │
│  │                                                   │ │
│  │  onMessage → captures transcript in real-time     │ │
│  └───────────────────┬─────────────────────────────┘ │
└───────────────────────┼─────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          │             │              │
          ▼             ▼              ▼
  ┌──────────────┐ ┌─────────┐ ┌──────────────┐
  │  ElevenLabs  │ │ Next.js │ │   MiniMax    │
  │  Voice Agent │ │   API   │ │   LLM API    │
  │              │ │ Routes  │ │              │
  │ • Warm voice │ │         │ │ Post-process │
  │ • Guided     │ │ Save &  │ │ transcript:  │
  │   check-in   │ │ query   │ │ • Mood score │
  │ • Follow-ups │ │ MongoDB │ │ • Themes     │
  │ • Empathetic │ │         │ │ • Insights   │
  └──────────────┘ └────┬────┘ │ • Summary    │
                        │      └──────────────┘
                        ▼
                  ┌──────────┐
                  │ MongoDB  │
                  │  Atlas   │
                  │          │
                  │ journals │
                  │ insights │
                  │ users    │
                  └──────────┘
```

### The Flow

1. **Resident taps "Start Journal"** → ElevenLabs voice agent connects
2. **Natural conversation** (3-5 min) — agent asks about their day, mood, wins, struggles
3. **Transcript captured** in real-time via `onMessage` callback
4. **Conversation ends** → full transcript sent to MiniMax LLM for analysis
5. **MiniMax extracts**: mood score, emotional themes, key events, coping patterns, a short summary
6. **Everything saved** to MongoDB — the raw conversation + structured insights
7. **Dashboard shows**: mood trends over time, journal entries with summaries, patterns

---

## 3. Technical Decisions

### Why ElevenLabs Voice Agent (not just TTS/STT)?

ElevenLabs Conversational AI is a **full voice agent** — it doesn't just speak, it *converses*. It handles:
- Turn-taking (knows when to listen vs speak)
- Natural follow-ups based on what the resident said
- Empathetic responses calibrated by our system prompt
- Low latency (sub-second) for natural conversation feel

We configure the agent in the ElevenLabs dashboard with our custom system prompt. The React SDK (`@elevenlabs/react`) gives us `useConversation()` hook with:
- `startSession({ agentId })` — begin voice conversation
- `endSession()` — end it
- `onMessage(msg)` — real-time transcript (user + agent messages)
- `status` — connection state
- `isSpeaking` — who's talking
- `conversationId` — unique ID for fetching full transcript later

### Why MiniMax for Post-Processing (not ElevenLabs' built-in analysis)?

ElevenLabs has conversation analysis, but it's designed for call center evaluation, not therapeutic journaling insight extraction. MiniMax gives us:
- **Custom prompt control** — we define exactly what to extract (mood 1-10, emotional themes, coping patterns, achievements, concerns)
- **Structured JSON output** — clean data for MongoDB storage and dashboard rendering
- **Narrative summary** — human-readable journal entry generated from the conversation
- **Required by hackathon** — MiniMax is a sponsor tech

### Why MongoDB?

- Journal entries are **document-shaped** (conversation transcript + nested insights)
- **Flexible schema** — different conversations produce different insights
- **Aggregation pipeline** — mood trends, theme frequency, pattern analysis over time
- **Required by hackathon**

### Transcript Capture Strategy

**Primary (Real-time)**: `onMessage` callback accumulates messages into a React state array during the conversation. When the user ends the session, we have the full transcript immediately on the client.

**Backup (Post-call)**: `GET /v1/convai/conversations/{conversationId}` from our API route — fetches the complete transcript with timestamps from ElevenLabs' servers. Used if real-time capture misses anything.

```typescript
// Real-time capture approach
const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

const conversation = useConversation({
  onMessage: (message) => {
    // message has: source ("user"|"ai"), message: string
    setTranscript(prev => [...prev, {
      role: message.source === 'user' ? 'user' : 'agent',
      text: message.message,
      timestamp: Date.now(),
      isFinal: !message.message.endsWith('...') // tentative vs final
    }]);
  },
  onDisconnect: () => {
    // Conversation ended — send transcript for processing
    processJournal(transcript);
  }
});
```

---

## 4. ElevenLabs Agent Configuration

### Agent System Prompt (configured in ElevenLabs Dashboard)

```
You are MeritMind, a warm and gentle journaling companion for residents 
in a supportive living house. You help people reflect on their day through 
natural conversation.

YOUR PERSONALITY:
- Warm, calm, genuinely interested
- Talk like a trusted friend, not a therapist
- Use simple, everyday language
- British English — "brilliant", "well done", "how was your day then?"
- Never judge, never lecture
- Celebrate even small wins ("That's really good, you know")
- If they mention something hard, acknowledge it simply: "That sounds tough"
- Don't probe too deep on painful topics — follow their lead
- Keep it conversational, not clinical

YOUR CONVERSATION FLOW:
1. Start warm: "Hey, how was your day today?"
2. Listen to their response. Ask ONE natural follow-up.
3. Gently explore their mood: "And how are you feeling about all that?"
4. If they mention something positive, celebrate it.
5. If they mention a struggle, validate it gently.
6. Ask if there's anything else on their mind.
7. Close warmly: "Thanks for sharing that with me. Get some rest, yeah?"

RULES:
- Keep the conversation to 3-5 minutes
- Ask one question at a time — never stack questions
- Don't offer advice unless they ask
- Don't mention prison, offending, criminal records, or labels
- Don't use therapy language ("boundaries", "triggers", "coping mechanisms")
- If they seem distressed, acknowledge and gently suggest talking to someone they trust
- Focus on TODAY — what happened, how they feel, what went well
```

### Voice Selection
- Pick the warmest, most natural British English voice available
- Male or female — test both during setup, pick whichever feels more approachable
- Moderate pace — not too fast, not slow

### Agent Settings
- **Connection**: WebRTC (lower latency)
- **Max duration**: 10 minutes (safety cap)
- **First message**: "Hey, how was your day today?" (agent speaks first)
- **Enable client events**: `onMessage` must be enabled in Advanced tab

---

## 5. MiniMax Post-Processing

When the conversation ends, the full transcript is sent to MiniMax LLM for structured analysis.

### Analysis Prompt

```
SYSTEM:
You are an AI that analyzes journal conversations from residents in a 
supportive living environment. Given a voice conversation transcript 
between a resident and their journaling companion, extract structured 
insights.

Be sensitive. These are real people sharing real feelings. Your analysis 
should be compassionate and strengths-focused — lead with what's going well.

Analyze the transcript and return ONLY valid JSON:

{
  "mood": {
    "score": <1-10 integer, 1=very low, 10=excellent>,
    "label": <"struggling"|"low"|"mixed"|"okay"|"good"|"great"|"excellent">,
    "description": <one sentence describing their emotional state>
  },
  "summary": <2-3 sentence natural language summary of their day, written 
    as a journal entry in first person — "I had a..." — as if the resident 
    wrote it themselves>,
  "themes": [<array of 1-4 emotional/topical themes, e.g. "loneliness", 
    "job progress", "family connection", "anxiety about future", "pride 
    in achievement">],
  "wins": [<array of positive things mentioned, even small ones>],
  "struggles": [<array of challenges or difficult feelings mentioned>],
  "people_mentioned": [<names or relationships mentioned: "Marcus", 
    "my daughter", "key worker">],
  "looking_forward_to": <anything they mentioned about tomorrow/future, 
    or null>,
  "concern_level": <"none"|"mild"|"moderate"|"high" — flag if resident 
    seems significantly distressed>,
  "conversation_quality": {
    "openness": <1-5, how freely they shared>,
    "duration_feel": <"brief"|"moderate"|"extended">,
    "engagement": <"minimal"|"moderate"|"high">
  }
}

USER:
Transcript:
{transcript}
```

---

## 6. Data Model (MongoDB)

### Collection: `users`

```json
{
  "_id": "ObjectId",
  "name": "Jay",
  "avatar": "👤",
  "houseId": "house-northampton-1",
  "movedIn": "2025-12-01",
  "currentStreak": 12,
  "totalJournals": 28,
  "createdAt": "2025-12-01T00:00:00Z"
}
```

### Collection: `journals` (the core data)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "userName": "Jay",
  "date": "2026-02-12",
  "conversationId": "el_conv_abc123",
  "durationSecs": 187,
  "transcript": [
    {
      "role": "agent",
      "text": "Hey, how was your day today?",
      "timestamp": 1707753600000
    },
    {
      "role": "user",
      "text": "Yeah it was alright actually. Went to the job centre this morning, and they told me about this forklift training course...",
      "timestamp": 1707753615000
    },
    {
      "role": "agent", 
      "text": "Oh nice, a forklift course? That sounds like a proper opportunity. How do you feel about it?",
      "timestamp": 1707753628000
    }
  ],
  "insights": {
    "mood": {
      "score": 7,
      "label": "good",
      "description": "Feeling positive after a productive day with concrete job progress"
    },
    "summary": "I had a decent day today. Went to the job centre and found out about a forklift training course which I'm buzzing about. Helped Marcus move some stuff in the afternoon. Feeling alright, just a bit tired.",
    "themes": ["job progress", "peer support", "cautious optimism"],
    "wins": [
      "Found forklift training opportunity at job centre",
      "Helped housemate Marcus with moving"
    ],
    "struggles": [
      "Feeling tired"
    ],
    "people_mentioned": ["Marcus"],
    "looking_forward_to": "Starting forklift training",
    "concern_level": "none",
    "conversation_quality": {
      "openness": 4,
      "duration_feel": "moderate",
      "engagement": "high"
    }
  },
  "createdAt": "2026-02-12T21:30:00Z"
}
```

---

## 7. Pages & User Flows

### Page 1: Home / User Selector (Demo)
- Warm landing page with Own Merit triangle motif
- Resident selector dropdown (for demo — no real auth)
- Shows greeting: "Evening, Jay" + current streak
- Big CTA: **"Start Tonight's Journal"** button
- Below: quick mood trend sparkline + last 3 journal summaries

### Page 2: Voice Journal Session
- Clean, focused mobile UI — minimal distractions
- Large pulsing circle/orb in center (visualizes audio activity)
- Shows conversation status: "Listening..." / "Speaking..." 
- Real-time transcript scrolling below the orb (live captions)
- "End Journal" button at bottom
- On end: brief loading spinner → "Processing your journal..." → redirect to entry

### Page 3: Journal Entry View
- Shows the generated **first-person summary** as the main content
- Mood indicator: emoji + score + label  
- Theme tags displayed as soft pills
- "Wins" highlighted in a warm card
- "Struggles" acknowledged gently
- Collapsible "Full conversation" section with transcript
- Navigation to dashboard

### Page 4: Dashboard / History
- **Mood trend chart**: Line graph of mood scores over last 14/30 days
- **Journal streak**: Current and longest
- **Recent entries**: Scrollable list with date, mood emoji, summary preview
- **Theme cloud** or frequency: What comes up most in conversations
- **Wins counter**: Total achievements mentioned this week/month

---

## 8. API Routes

| Route | Method | Purpose | External API |
|---|---|---|---|
| `/api/users` | GET | List users (demo) | — |
| `/api/users/[id]` | GET | Get user profile + stats | — |
| `/api/signed-url` | GET | Get ElevenLabs signed URL for private agent | ElevenLabs |
| `/api/journals` | POST | Save transcript + trigger MiniMax analysis | MiniMax LLM |
| `/api/journals` | GET | List journals for user (with date filters) | — |
| `/api/journals/[id]` | GET | Get single journal with insights | — |
| `/api/dashboard/[userId]` | GET | Aggregated: mood trend, streak, theme frequency, recent wins | — |
| `/api/seed` | POST | Populate demo data | — |

### POST `/api/journals` — The Core Route

This is where the magic happens:

```typescript
// 1. Receive transcript from client
const { userId, conversationId, transcript, durationSecs } = body;

// 2. Format transcript for MiniMax
const formattedTranscript = transcript
  .map(t => `${t.role === 'user' ? 'Resident' : 'MeritMind'}: ${t.text}`)
  .join('\n');

// 3. Send to MiniMax for analysis
const insights = await minimax.analyzeJournal(formattedTranscript);

// 4. Save everything to MongoDB
const journal = await Journal.create({
  userId, conversationId, transcript, 
  durationSecs, insights, date: today()
});

// 5. Update user streak
await updateStreak(userId);

// 6. Return the processed entry
return { success: true, data: journal };
```

---

## 9. Project Structure

```
meritmind/
├── .cursorrules
├── .env.local
├── package.json
├── next.config.js
├── tailwind.config.ts
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout (warm mobile-first)
│   │   ├── page.tsx                      ← Home / resident selector
│   │   ├── globals.css
│   │   │
│   │   ├── journal/
│   │   │   ├── page.tsx                  ← Voice conversation session
│   │   │   └── [id]/page.tsx             ← View completed journal entry
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← Mood trends + history
│   │   │
│   │   └── api/
│   │       ├── users/
│   │       │   └── route.ts
│   │       ├── signed-url/
│   │       │   └── route.ts              ← ElevenLabs signed URL
│   │       ├── journals/
│   │       │   ├── route.ts              ← POST (save+analyze) + GET (list)
│   │       │   └── [id]/route.ts
│   │       ├── dashboard/
│   │       │   └── [userId]/route.ts
│   │       └── seed/
│   │           └── route.ts
│   │
│   ├── lib/
│   │   ├── mongodb.ts                    ← Connection singleton
│   │   ├── minimax.ts                    ← analyzeJournal() function
│   │   ├── prompts.ts                    ← MiniMax prompt templates
│   │   └── types.ts                      ← TypeScript interfaces
│   │
│   ├── models/
│   │   ├── User.ts
│   │   └── Journal.ts
│   │
│   └── components/
│       ├── VoiceOrb.tsx                  ← Animated audio visualization orb
│       ├── LiveTranscript.tsx            ← Real-time scrolling transcript
│       ├── MoodBadge.tsx                 ← Emoji + score + label
│       ├── JournalCard.tsx               ← Summary card for history list
│       ├── MoodChart.tsx                 ← Mood trend line graph
│       ├── ThemeTags.tsx                 ← Soft pill tags
│       ├── WinsCard.tsx                  ← Highlighted achievements
│       ├── StreakDisplay.tsx             ← Streak counter
│       ├── UserSelector.tsx             ← Demo user picker
│       └── ProcessingScreen.tsx         ← Loading state after conversation
```

---

## 10. UI/UX Design

### Mobile-First (Critical)

Residents use phones, not laptops. Every screen must work beautifully at 375px width.

### Design Tokens

```
Background:     bg-stone-50 (warm off-white)
Surface:        bg-white rounded-2xl shadow-sm
Primary:        teal-600 (#0D9488)
Accent warm:    amber-500 (#F59E0B)
Mood excellent:  emerald-500
Mood good:       teal-500
Mood okay:       amber-500
Mood low:        orange-500
Mood struggling:  rose-400
Text primary:    stone-800
Text secondary:  stone-500
Corners:         rounded-2xl everywhere
Spacing:         generous — p-6 cards, gap-4 stacks
Tap targets:     min 48px
```

### The Voice Journal Screen (The Hero)

This is the screen that wins the demo. It needs to feel **magical**.

```
┌─────────────────────────────┐
│                             │
│     Evening, Jay ☀️→🌙      │
│     Day 12 of journaling    │
│                             │
│                             │
│         ┌───────┐           │
│        /  ◉◉◉◉  \          │  ← Pulsing orb
│       |  ◉◉◉◉◉◉  |         │     Animates with audio
│        \  ◉◉◉◉  /          │     Teal when listening
│         └───────┘           │     Amber when agent speaks
│                             │
│     🎙️ Listening...         │
│                             │
│  ┌─────────────────────────┐│
│  │ MeritMind: Hey, how was ││  ← Live transcript
│  │ your day today?         ││     Scrolls as conversation
│  │                         ││     progresses
│  │ You: Yeah it was alright││
│  │ actually. Went to the   ││
│  │ job centre...           ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │    End Journal ✓        ││  ← Prominent end button
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Post-Conversation: The "Processing" Moment

After ending the conversation, show a warm processing screen:
- "Processing your journal..." 
- Gentle loading animation (the orb slowly transforming into a journal page)
- 2-3 seconds typical (MiniMax processing)
- Then transitions to the completed journal entry view

### Journal Entry View

```
┌─────────────────────────────┐
│  ← Back           Feb 12    │
│                             │
│  😊 Good (7/10)             │  ← MoodBadge
│                             │
│  "I had a decent day today. │  ← First-person summary
│   Went to the job centre    │     (generated by MiniMax)
│   and found out about a     │
│   forklift training course  │
│   which I'm buzzing about.  │
│   Helped Marcus move some   │
│   stuff. Feeling alright,   │
│   just a bit tired."        │
│                             │
│  ┌─────────────────────────┐│
│  │ 🏆 Wins                 ││
│  │ • Found forklift course ││
│  │ • Helped Marcus move    ││
│  └─────────────────────────┘│
│                             │
│  💭 job progress · peer     │  ← Theme tags
│     support · optimism      │
│                             │
│  ▸ View full conversation   │  ← Collapsible transcript
│                             │
└─────────────────────────────┘
```

---

## 11. Feature Priority & Build Timeline (2.5 Hours)

### Phase 1: Scaffold + Infrastructure (0–15 min)

- [ ] `npx create-next-app` + Tailwind + shadcn/ui
- [ ] `npm install @elevenlabs/react mongoose`
- [ ] `.env.local` with: `ELEVENLABS_API_KEY`, `NEXT_PUBLIC_AGENT_ID`, `MINIMAX_API_KEY`, `MINIMAX_GROUP_ID`, `MONGODB_URI`
- [ ] `lib/mongodb.ts` — connection singleton
- [ ] `lib/minimax.ts` — `analyzeJournal(transcript)` function
- [ ] `lib/prompts.ts` — analysis prompt template
- [ ] `models/User.ts` + `models/Journal.ts` — Mongoose schemas
- [ ] `api/seed/route.ts` — seed 1 house, 4 residents, 15 days of demo journal data for Jay

**Checkpoint**: Seed data visible in MongoDB Atlas ✅

### Phase 2: Voice Conversation (15–55 min)

- [ ] `api/signed-url/route.ts` — ElevenLabs signed URL endpoint
- [ ] `components/VoiceOrb.tsx` — animated circle that pulses with audio
- [ ] `components/LiveTranscript.tsx` — scrolling real-time captions
- [ ] `journal/page.tsx` — voice journal session page with:
  - `useConversation()` hook from `@elevenlabs/react`
  - `onMessage` handler accumulating transcript
  - Start/End session controls
  - Orb + transcript display
- [ ] `components/ProcessingScreen.tsx` — post-conversation loading

**Checkpoint**: Can have a live voice conversation, see transcript in real-time ✅

### Phase 3: Analysis + Storage (55–85 min)

- [ ] `api/journals/route.ts` POST — receive transcript → MiniMax analysis → save to MongoDB
- [ ] `api/journals/route.ts` GET — list journals filtered by userId
- [ ] `api/journals/[id]/route.ts` GET — single journal with insights
- [ ] Wire up: conversation end → POST transcript → redirect to journal entry
- [ ] `journal/[id]/page.tsx` — journal entry view with summary, mood, wins, themes

**Checkpoint**: Complete flow — talk → process → see journal entry with AI insights ✅

### Phase 4: Dashboard + History (85–115 min)

- [ ] `api/dashboard/[userId]/route.ts` — aggregate mood trend, streak, recent entries, top themes
- [ ] `components/MoodChart.tsx` — simple mood line chart (last 14 days)
- [ ] `components/StreakDisplay.tsx` — streak counter with fire emoji
- [ ] `components/JournalCard.tsx` — summary card for history list
- [ ] `components/ThemeTags.tsx` — soft tag pills
- [ ] `dashboard/page.tsx` — compose all dashboard components
- [ ] Home page (`page.tsx`) — user selector + quick stats + CTA

**Checkpoint**: Dashboard shows Jay's 15-day mood journey with trends and history ✅

### Phase 5: Polish + Demo Prep (115–150 min)

- [ ] Loading skeletons on all data fetches
- [ ] Smooth page transitions (fade-in)
- [ ] Voice orb animation polish (use `getInputByteFrequencyData` for real audio visualization)
- [ ] Mobile responsive pass — test at 375px
- [ ] **Pre-generate 1 journal entry as backup** (in case ElevenLabs is slow during demo)
- [ ] **Pre-seed 15 days of realistic data** (mood arc: week 1 mixed, week 2 improving)
- [ ] End-to-end demo flow test
- [ ] Practice 90-second pitch

---

## 12. Demo Script (90 seconds)

**[Show: Mobile-friendly home screen, warm design]**

> "69% of prison leavers reoffend within a year. Own Merit is changing that with supportive housing. But here's the thing — most residents won't fill in forms or type journal entries at the end of the day. They're tired. Some struggle with literacy."

**[Tap: "Start Tonight's Journal"]**

> "So we made journaling as easy as having a conversation."

**[Live: Voice conversation starts. The orb pulses. Agent says "Hey, how was your day?"]**

> *Respond naturally for 15-20 seconds: "Yeah not bad actually, went to the job centre, found a training course..."*

**[Point to live transcript scrolling]**

> "Real-time transcript, powered by ElevenLabs voice agents. The resident just talks naturally — no typing, no forms."

**[Tap: "End Journal"]**

**[Show: Processing screen → Journal entry appears]**

> "When the conversation ends, MiniMax analyses every nuance. Mood score. Emotional themes. Wins and struggles. And it writes a first-person journal entry — as if the resident wrote it themselves."

**[Show: Journal entry with mood badge, wins card, themes]**

**[Navigate: Dashboard]**

> "Over time, this builds a picture. Mood trends. Journaling streaks. Recurring themes. Staff can see who might be struggling before it becomes a crisis — without being intrusive."

**[Show: Mood chart trending upward, streak counter, theme cloud]**

**[Pause]**

> "MeritMind turns a 3-minute conversation into a rich, searchable journal. No typing required. Just talk about your day — we'll remember the good stuff."

---

## 13. ElevenLabs Agent Setup Checklist

Before the hackathon:

1. **Create agent** in ElevenLabs dashboard
2. **Paste system prompt** from Section 4 above
3. **Select voice**: British English, warm, natural (test Sarah, Daniel, or similar)
4. **Set first message**: "Hey, how was your day today?"
5. **Enable authentication** (private agent → need signed URLs)
6. **Enable `onMessage` client event** in Advanced tab
7. **Set max duration**: 600 seconds (10 min)
8. **Test conversation** in dashboard preview
9. **Copy Agent ID** → put in `.env.local`
10. **Get API key** → put in `.env.local`

---

## 14. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| ElevenLabs latency/failure | Low | Critical | Pre-record a demo conversation video as backup. Have mock transcript data ready. |
| Microphone permission denied | Medium | High | Clear permission request UI before starting. Fallback: text input mode. |
| MiniMax returns bad JSON | Medium | Medium | try/catch + retry + fallback to basic extraction |
| MiniMax slow (>5s) | Medium | Medium | Show warm processing animation. Pre-generate one entry as instant fallback. |
| Audio orb complex | Medium | Low | Start with simple CSS pulsing circle. Upgrade to frequency data if time. |
| Browser compatibility | Low | Medium | Test Chrome + Safari mobile before demo |
| Demo laptop mic issues | Medium | High | Test mic in venue beforehand. Have phone as backup device. |

---

## 15. Judging Criteria Alignment

| Criteria | MeritMind's Score |
|---|---|
| **Real-world impact** | Voice removes literacy barrier — the #1 reason journaling fails for this population. Mood trend data enables early intervention. |
| **Technical excellence** | ElevenLabs voice agent (real-time conversation) + MiniMax LLM (nuance extraction) + MongoDB (longitudinal storage) — three sponsor technologies deeply integrated. |
| **Innovation** | Voice-first journaling that writes itself. The resident just talks; AI produces structured, searchable journal entries. No similar product exists for supported living. |
| **Long-term vision** | Scales to all Own Merit houses → any supported living provider. Integrates with housing reviews, probation evidence, wellbeing monitoring. |
| **Collaborative problem solving** | Built around Own Merit's actual peer support model. Residents talking naturally about their day, including mentions of helping housemates. |

---

## 16. Why Voice Wins This Hackathon

1. **The demo is inherently impressive** — a live voice conversation with an AI that sounds human is jaw-dropping to non-technical judges
2. **It directly solves the accessibility problem** — Darryn knows his residents won't type
3. **It's the wellbeing journal idea from the brief, but executed at 10x** — they suggested a typing journal, we made it voice-first
4. **The processing reveal is magical** — conversation ends, and a beautifully structured journal entry appears
5. **The mood chart tells the story** — 15 days of seeded data showing a resident's genuine improvement arc

---

## 17. Post-Hackathon Vision

**Phase 1 (Now)**: Voice journal → AI insights → mood dashboard

**Phase 2 (1 month)**: Multi-house deployment. Key worker dashboard (anonymous aggregate: "3 of 6 residents journaled today, house mood average 6.8"). Push notification reminders.

**Phase 3 (3 months)**: Integration with Own Merit's operational tools. Pattern detection: "Jay's mood has dipped 3 days in a row — flag for key worker." Export evidence reports for probation/housing reviews.

**Phase 4 (6 months)**: WhatsApp voice note integration (residents send a voice note → same pipeline). SMS fallback for residents without smartphones. Multi-language support (many prison leavers speak English as second language).

**Phase 5 (12 months)**: The standard voice journaling platform for supported living across the UK. Research data (anonymised) for evidence-based policy. Integration with NHS mental health referral pathways.