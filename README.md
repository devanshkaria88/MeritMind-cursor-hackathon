# MeritMind

### *"Talk about your day. We'll remember the good stuff."*

> Voice-first mood journaling for residents in supportive living. No typing. No forms. Just talk.

---

## The Problem

69% of prison leavers reoffend within a year. Organisations like **Own Merit** are changing that with supportive housing — but tracking resident wellbeing is hard. Traditional journaling doesn't work here:

- Many residents have **low literacy** — typing is a barrier
- End-of-day **energy is low** — filling forms feels like homework
- Written journals feel like **compliance**, not care

Staff need insight into how residents are doing. Residents need a way to reflect that doesn't feel like a chore.

## The Solution

MeritMind turns a **3-minute voice conversation** into a rich, structured mood journal.

A resident taps one button. A warm, empathetic AI companion asks about their day. They just *talk* — like chatting with a friend before bed. When the conversation ends, the system silently extracts mood, themes, wins, struggles, and patterns. No typing required. Ever.

```
Resident speaks  ──>  AI companion listens  ──>  Structured journal appears
    (voice)              (ElevenLabs)              (MiniMax + MongoDB)
```

Over time, MeritMind builds a picture: mood trends, recurring themes, progress arcs, early warning signs — all from natural conversations residents actually *enjoy* having.

---

## How It Works

```
┌──────────────────────────────────────────────────────────────────┐
│  1. TALK            2. ANALYSE              3. TRACK            │
│                                                                  │
│  Resident has a     MiniMax LLM extracts    MongoDB stores      │
│  natural voice      mood (1-10), themes,    everything. Mood    │
│  conversation       wins, struggles, and     trends, streaks,   │
│  with ElevenLabs    writes a first-person    and patterns       │
│  voice agent        journal summary          emerge over time   │
│                                                                  │
│  "Yeah it was       { mood: 7,              📈 Mood trending   │
│   alright today,      summary: "I had a       upward over      │
│   went to the job     decent day...",         2 weeks           │
│   centre..."          wins: ["forklift      🔥 15-day streak   │
│                        training"] }          💭 Top theme:      │
│                                                "job progress"   │
└──────────────────────────────────────────────────────────────────┘
```

### The Smart Part: Personalised Monitoring

Every resident has **admin-assigned chores** and **monitored traits** set by their support team. These are dynamically injected into the voice agent's prompt as context:

- **Chores**: The agent casually asks *"Did you get round to cleaning the kitchen today?"* — not as a checklist, but woven naturally into conversation
- **Traits**: If a resident has a history of alcohol dependency, the agent gently asks about their evening and social activities — *never* directly asking "did you drink?" — letting the analysis system detect patterns

The voice agent adapts its conversation to each resident without them ever knowing. Staff get insight. Residents get a friend.

---

## Tech Stack

### ElevenLabs — The Voice

[ElevenLabs Conversational AI](https://elevenlabs.io) powers the real-time voice agent. Not just text-to-speech — a full **conversational AI** that handles turn-taking, empathetic responses, and natural follow-ups. The `@elevenlabs/react` SDK provides:

- `useConversation()` hook for session management
- `onMessage` callback for real-time transcript capture
- `dynamicVariables` to inject per-resident chores and traits into the agent's prompt at session start
- Signed URLs for private agent authentication

The agent speaks with a warm British English voice and is prompted to sound like a kind housemate, not a therapist.

### MiniMax — The Brain

[MiniMax](https://www.minimaxi.com) LLM (`MiniMax-M2.1`) handles post-conversation analysis. When a voice session ends, the full transcript is sent to MiniMax with a structured extraction prompt. It returns:

```json
{
  "mood": { "score": 7, "label": "good", "description": "..." },
  "summary": "I had a decent day today. Went to the job centre and...",
  "themes": ["job progress", "peer support"],
  "wins": ["Found forklift training opportunity"],
  "struggles": ["Feeling tired"],
  "concern_level": "none",
  "conversation_quality": { "openness": 4, "engagement": "high" }
}
```

The summary is written in first person — *as if the resident wrote it themselves*. This is the journal entry. The resident spoke for 3 minutes; MiniMax turned it into a structured document with mood scoring, theme extraction, and concern flagging.

### MongoDB — The Memory

[MongoDB Atlas](https://www.mongodb.com/atlas) stores everything:

- **Users** — profiles with admin-assigned chores and monitored traits
- **Journals** — raw conversation transcripts alongside MiniMax-extracted insights
- **Aggregations** — mood trends over 14/30 days, theme frequency analysis, streak tracking

The document model is perfect here: each journal entry is a rich, nested document containing the conversation transcript and all extracted insights in one place.

### Cursor — The Builder

The entire application was built in **2.5 hours** during the hackathon using [Cursor](https://cursor.com) as the AI-powered IDE. Cursor's agent mode handled:

- Scaffolding the Next.js 14 project with TypeScript, Tailwind, and shadcn/ui
- Generating 15 days of realistic seed data with authentic conversation transcripts
- Wiring up the ElevenLabs SDK integration with dynamic variable passing
- Building the MiniMax analysis pipeline with JSON extraction and validation
- Creating the responsive mobile-first UI with animated voice orb, mood charts, and dashboard
- Iterating on the ElevenLabs system prompt for natural conversation flow

---

## Features

- **Voice Orb** — Animated pulsing circle that responds to audio. Teal when listening, amber when the agent speaks.
- **Live Transcript** — Real-time scrolling captions during the conversation
- **Mood Scoring** — 1-10 scale with emoji indicators and colour coding
- **Journal Summaries** — First-person narratives generated from conversations
- **Theme Extraction** — Recurring topics tracked as pill tags
- **Win Tracking** — Positive moments highlighted and celebrated
- **Mood Trends** — Line chart showing emotional trajectory over time
- **Streak Counter** — Journaling consistency gamification
- **House Tasks** — Admin-assigned chores that the voice agent casually checks in on
- **Support Team Flags** — Monitored traits (admin-only view) passed to the agent for gentle probing
- **Mobile-First Design** — Optimised for 375px phone screens with generous tap targets

---

## Project Structure

```
src/
  app/
    page.tsx                    # Home — resident selector + CTA
    journal/
      page.tsx                  # Voice conversation session
      [id]/page.tsx             # Completed journal entry view
    dashboard/
      page.tsx                  # Mood trends, history, chores, traits
    api/
      signed-url/route.ts      # ElevenLabs signed URL
      journals/route.ts         # POST: save + analyse | GET: list
      journals/[id]/route.ts    # Single journal entry
      dashboard/[userId]/route.ts # Aggregated stats
      users/route.ts            # List residents
      users/[id]/route.ts       # Single resident with chores/traits
      seed/route.ts             # Demo data population
  lib/
    mongodb.ts                  # Connection singleton
    minimax.ts                  # analyzeJournal() with validation
    prompts.ts                  # MiniMax prompt templates
    types.ts                    # All TypeScript interfaces
  models/
    User.ts                     # Mongoose schema with chores + traits
    Journal.ts                  # Transcript + insights schema
  components/
    VoiceOrb.tsx                # Animated audio visualisation
    LiveTranscript.tsx          # Real-time conversation captions
    MoodBadge.tsx               # Emoji + score display
    MoodChart.tsx               # Recharts mood trend line
    JournalCard.tsx             # Summary card for history
    ThemeTags.tsx               # Soft pill tags
    WinsCard.tsx                # Achievement highlights
    StreakDisplay.tsx            # Streak counter
    UserSelector.tsx            # Resident picker
    ProcessingScreen.tsx        # Post-conversation loading
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- ElevenLabs account with Conversational AI agent
- MiniMax API key

### Setup

```bash
git clone https://github.com/devanshkaria88/mindMaster-cursor-hackathon.git
cd mindMaster-cursor-hackathon
npm install
```

Create `.env.local`:

```env
ELEVENLABS_API_KEY=your-elevenlabs-api-key
NEXT_PUBLIC_AGENT_ID=your-elevenlabs-agent-id
MINIMAX_API_KEY=your-minimax-api-key
MONGODB_URI=your-mongodb-atlas-uri
```

### ElevenLabs Agent Setup

1. Create a Conversational AI agent in the ElevenLabs dashboard
2. Paste the system prompt (uses `{{resident_name}}`, `{{chores}}`, `{{monitored_traits}}` dynamic variables)
3. Set first message: `Hey {{resident_name}}! So tell me — what's one thing that went right today?`
4. Enable `onMessage` client events in the Advanced tab
5. Select a warm British English voice
6. Copy the Agent ID to `.env.local`

### Run

```bash
npm run dev
```

Seed demo data by hitting `POST /api/seed` (or visiting it in browser tools). This creates 4 residents with 15 days of realistic journal data showing authentic emotional arcs.

---

## The Demo Arc

The seed data tells a story. **Jay** — a new resident — goes from uncertainty and boredom (mood 4) through a rough patch missing his daughter's birthday (mood 3), into recovery via a forklift training course, and emerges with his licence, a job trial, and approved contact with his daughter (mood 8). Two weeks, captured in voice conversations. That's the power of MeritMind.

---

## Built For

**Cursor x MiniMax Northampton Hackathon** — *"The Own Merit Challenge"*

February 2026 | Built in 2.5 hours

---

*MeritMind — because everyone deserves to be heard.*
