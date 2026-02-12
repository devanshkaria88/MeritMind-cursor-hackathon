import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Journal from '@/models/Journal';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function ts(daysBack: number, minuteOffset: number): number {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(21, minuteOffset, 0, 0);
  return d.getTime();
}

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    await User.deleteMany({});
    await Journal.deleteMany({});

    // Create users
    const jay = await User.create({
      name: 'Jay',
      avatar: '👤',
      houseId: 'house-northampton-1',
      movedIn: new Date('2025-12-01'),
      currentStreak: 15,
      totalJournals: 15,
      chores: [
        'Clean the kitchen after dinner',
        'Take out the bins on Wednesday',
        'Hoover the communal hallway on Friday',
      ],
      traits: [
        { name: 'Cannabis use', notes: 'Previously regular cannabis user. 2 months clean. Watch for signs of relapse — withdrawal to room, change in sleep patterns, reduced motivation.' },
        { name: 'Anxiety', notes: 'Experiences anxiety especially around new situations and crowds. Can lead to avoidance of appointments.' },
      ],
    });

    const marcus = await User.create({
      name: 'Marcus',
      avatar: '👤',
      houseId: 'house-northampton-1',
      movedIn: new Date('2025-10-15'),
      currentStreak: 5,
      totalJournals: 5,
      chores: [
        'Clean the bathroom on Tuesday',
        'Tidy the garden and outside area on Thursday',
        'Cook house dinner on Saturday',
      ],
      traits: [
        { name: 'Alcohol dependency', notes: '6 months sober. History of heavy drinking. Watch for mentions of pubs, social drinking, or buying alcohol.' },
        { name: 'Anger management', notes: 'Has worked on anger management. Can escalate in confrontational situations. Watch for conflicts with housemates or at work.' },
      ],
    });

    const lisa = await User.create({
      name: 'Lisa',
      avatar: '👤',
      houseId: 'house-northampton-1',
      movedIn: new Date('2025-11-20'),
      currentStreak: 2,
      totalJournals: 4,
      chores: [
        'Wipe down kitchen surfaces on Monday',
        'Tidy the laundry room on Wednesday',
        'Help with communal dinner on Thursday',
      ],
      traits: [
        { name: 'Prescription drug misuse', notes: 'Previously self-medicated with benzodiazepines. Now on managed prescription. Watch for mentions of extra tablets, buying meds, or poor sleep driving self-medication.' },
        { name: 'Low mood and withdrawal', notes: 'Prone to depressive episodes. Signs include not leaving room, skipping meals, dropping routines. Encourage gentle activity.' },
      ],
    });

    const danny = await User.create({
      name: 'Danny',
      avatar: '👤',
      houseId: 'house-northampton-1',
      movedIn: new Date('2026-01-28'),
      currentStreak: 3,
      totalJournals: 3,
      chores: [
        'Take out the bins on Tuesday',
        'Sweep the hallways on Friday',
        'Tidy the living room on Saturday',
      ],
      traits: [
        { name: 'Drug dependency', notes: 'History with cannabis and spice. Recently clean. Watch for mentions of old associates, staying out late, or unexplained tiredness.' },
        { name: 'Social isolation', notes: 'Tends to withdraw and avoid social contact. Can go days without speaking to anyone. Encourage small interactions.' },
      ],
    });

    // --- JAY's 15 days ---
    const jayEntries = [
      // Day 15 (oldest) — mood 4, uncertainty
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(14),
        conversationId: 'el_conv_jay_01', durationSecs: 145,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(14, 0) },
          { role: 'user' as const, text: "Yeah... it was alright I suppose. Just kind of wandered about a bit. Still getting used to everything here.", timestamp: ts(14, 1) },
          { role: 'agent' as const, text: "That makes total sense. It takes a bit to settle in, doesn't it? What's the place been like so far?", timestamp: ts(14, 2) },
          { role: 'user' as const, text: "It's clean, which is good. And quiet. I dunno, just feels weird having my own space again.", timestamp: ts(14, 3) },
          { role: 'agent' as const, text: "Having your own space is a big deal though. That's something. How are you feeling about it all?", timestamp: ts(14, 4) },
          { role: 'user' as const, text: "Bit nervous if I'm honest. But alright. Just taking it day by day.", timestamp: ts(14, 5) },
          { role: 'agent' as const, text: "Day by day is the way to do it. Thanks for sharing that with me. Get some rest, yeah?", timestamp: ts(14, 6) },
        ],
        insights: {
          mood: { score: 4, label: 'okay', description: 'Feeling uncertain but managing, still adjusting to new surroundings' },
          summary: "I had an alright day today. Still getting used to everything here — it feels a bit weird having my own space again, but it's clean and quiet. Taking it day by day.",
          themes: ['uncertainty', 'adjusting', 'new beginnings'],
          wins: ['Has own clean space', 'Being honest about feelings'],
          struggles: ['Feeling nervous', 'Still settling in'],
          people_mentioned: [],
          looking_forward_to: null,
          concern_level: 'mild',
          conversation_quality: { openness: 3, duration_feel: 'moderate', engagement: 'moderate' },
        },
      },
      // Day 14 — mood 4
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(13),
        conversationId: 'el_conv_jay_02', durationSecs: 130,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(13, 0) },
          { role: 'user' as const, text: "Not much happened really. Watched some telly. Had a wander to the shops.", timestamp: ts(13, 1) },
          { role: 'agent' as const, text: "Sometimes a quiet day is exactly what you need. Did you get anything nice from the shops?", timestamp: ts(13, 2) },
          { role: 'user' as const, text: "Just some bits. Milk and that. Met one of the other lads in the kitchen though — Marcus. He seems alright.", timestamp: ts(13, 3) },
          { role: 'agent' as const, text: "Nice one, good to start getting to know people. How are you feeling tonight?", timestamp: ts(13, 4) },
          { role: 'user' as const, text: "Yeah okay. Bit bored maybe. But okay.", timestamp: ts(13, 5) },
          { role: 'agent' as const, text: "That's fair. Tomorrow's another day. Sleep well, Jay.", timestamp: ts(13, 6) },
        ],
        insights: {
          mood: { score: 4, label: 'okay', description: 'Quiet day, a bit bored but managing okay' },
          summary: "Not much happened today really. Went to the shops and met Marcus in the kitchen — he seems alright. Feeling a bit bored but okay overall.",
          themes: ['adjusting', 'boredom', 'new connections'],
          wins: ['Got out to the shops', 'Met housemate Marcus'],
          struggles: ['Feeling bored'],
          people_mentioned: ['Marcus'],
          looking_forward_to: null,
          concern_level: 'none',
          conversation_quality: { openness: 3, duration_feel: 'brief', engagement: 'moderate' },
        },
      },
      // Day 13 — mood 5
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(12),
        conversationId: 'el_conv_jay_03', durationSecs: 160,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(12, 0) },
          { role: 'user' as const, text: "Better today actually. Had my first meeting with my key worker. She was really sound.", timestamp: ts(12, 1) },
          { role: 'agent' as const, text: "Oh brilliant, that's a good start. What kind of things did you talk about?", timestamp: ts(12, 2) },
          { role: 'user' as const, text: "Just getting set up really. She helped me sort out my Universal Credit and talked about what support's available. Felt useful.", timestamp: ts(12, 3) },
          { role: 'agent' as const, text: "That sounds really productive. Getting the practical stuff sorted makes a big difference. How are you feeling about things now?", timestamp: ts(12, 4) },
          { role: 'user' as const, text: "A bit more hopeful I think. Like maybe this could actually work out.", timestamp: ts(12, 5) },
          { role: 'agent' as const, text: "That's really good to hear. Sounds like a proper solid day. Rest up, yeah?", timestamp: ts(12, 6) },
        ],
        insights: {
          mood: { score: 5, label: 'okay', description: 'Feeling more hopeful after productive meeting with key worker' },
          summary: "I had a better day today. Met my key worker for the first time and she was really sound — helped me sort out my Universal Credit and told me about the support available. Feeling a bit more hopeful.",
          themes: ['progress', 'support', 'cautious optimism'],
          wins: ['Met key worker', 'Sorted Universal Credit', 'Feeling more hopeful'],
          struggles: [],
          people_mentioned: ['key worker'],
          looking_forward_to: 'Getting more settled',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 12 — mood 5, job search
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(11),
        conversationId: 'el_conv_jay_04', durationSecs: 175,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(11, 0) },
          { role: 'user' as const, text: "Yeah not bad. Started looking at jobs online. There's a few warehouse ones that look doable.", timestamp: ts(11, 1) },
          { role: 'agent' as const, text: "Nice, good on you for getting stuck in. Anything that caught your eye?", timestamp: ts(11, 2) },
          { role: 'user' as const, text: "There's one at the distribution centre that doesn't need much experience. Might apply tomorrow.", timestamp: ts(11, 3) },
          { role: 'agent' as const, text: "That sounds like a solid plan. How's the rest of the day been?", timestamp: ts(11, 4) },
          { role: 'user' as const, text: "Cooked tea for the first time in ages. Just pasta but still. Marcus showed me where everything was in the kitchen.", timestamp: ts(11, 5) },
          { role: 'agent' as const, text: "Cooking for yourself — that's brilliant. Sounds like a good day. Get some rest.", timestamp: ts(11, 6) },
        ],
        insights: {
          mood: { score: 5, label: 'okay', description: 'Taking positive steps with job searching and settling into routines' },
          summary: "I started looking at jobs online today and found a warehouse one at the distribution centre that looks doable. Cooked pasta for the first time in ages too — Marcus showed me around the kitchen.",
          themes: ['job search', 'routine', 'independence'],
          wins: ['Started job searching', 'Cooked own meal', 'Found a job to apply for'],
          struggles: [],
          people_mentioned: ['Marcus'],
          looking_forward_to: 'Applying for warehouse job',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 11 — mood 6
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(10),
        conversationId: 'el_conv_jay_05', durationSecs: 185,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(10, 0) },
          { role: 'user' as const, text: "Good actually! Went to the job centre and they told me about this forklift training course.", timestamp: ts(10, 1) },
          { role: 'agent' as const, text: "Oh nice, a forklift course? That sounds like a proper opportunity. How do you feel about it?", timestamp: ts(10, 2) },
          { role: 'user' as const, text: "Yeah buzzing actually. It's free and only two weeks. And once you've got the licence, loads of places are hiring.", timestamp: ts(10, 3) },
          { role: 'agent' as const, text: "That's brilliant. Two weeks and you've got something real on your CV. What else happened today?", timestamp: ts(10, 4) },
          { role: 'user' as const, text: "Helped Marcus move some furniture in the afternoon. We had a laugh actually. It's nice having people around.", timestamp: ts(10, 5) },
          { role: 'agent' as const, text: "Sounds like a really solid day. Nice one, Jay. Sleep well tonight.", timestamp: ts(10, 6) },
        ],
        insights: {
          mood: { score: 6, label: 'good', description: 'Feeling positive and excited about forklift training opportunity' },
          summary: "I had a good day today. Went to the job centre and found out about a free forklift training course — only two weeks and loads of places are hiring after. Helped Marcus move furniture in the afternoon and had a proper laugh.",
          themes: ['job progress', 'peer support', 'optimism'],
          wins: ['Found forklift training course', 'Helped Marcus move furniture', 'Building friendships'],
          struggles: [],
          people_mentioned: ['Marcus'],
          looking_forward_to: 'Starting forklift training',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 10 — mood 6
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(9),
        conversationId: 'el_conv_jay_06', durationSecs: 150,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(9, 0) },
          { role: 'user' as const, text: "Alright yeah. Did some cleaning, sorted my room out properly. Feels more like mine now.", timestamp: ts(9, 1) },
          { role: 'agent' as const, text: "Making your space your own — that's important. How does it feel?", timestamp: ts(9, 2) },
          { role: 'user' as const, text: "Good actually. Like I'm settling in a bit. Had a cuppa with Lisa in the afternoon too.", timestamp: ts(9, 3) },
          { role: 'agent' as const, text: "That's lovely. Sounds like you're finding your feet. Anything on your mind tonight?", timestamp: ts(9, 4) },
          { role: 'user' as const, text: "Nah not really. Just looking forward to hearing about the forklift thing. Should get a call this week.", timestamp: ts(9, 5) },
          { role: 'agent' as const, text: "Fingers crossed for that call. Nice day, Jay. Get some rest.", timestamp: ts(9, 6) },
        ],
        insights: {
          mood: { score: 6, label: 'good', description: 'Settling in well and feeling more at home' },
          summary: "I sorted my room out properly today and it finally feels like mine. Had a cuppa with Lisa in the afternoon. Waiting to hear back about the forklift training — should get a call this week.",
          themes: ['settling in', 'routine', 'community'],
          wins: ['Made room feel like home', 'Socialising with housemates'],
          struggles: [],
          people_mentioned: ['Lisa'],
          looking_forward_to: 'Forklift training call',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 9 — mood 5
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(8),
        conversationId: 'el_conv_jay_07', durationSecs: 140,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(8, 0) },
          { role: 'user' as const, text: "It was okay. Bit of a quiet one. Applied for a couple more jobs online.", timestamp: ts(8, 1) },
          { role: 'agent' as const, text: "Good on you for keeping at it. How did that feel?", timestamp: ts(8, 2) },
          { role: 'user' as const, text: "Alright I suppose. The forms are a pain but I got through them. Marcus helped me with my email.", timestamp: ts(8, 3) },
          { role: 'agent' as const, text: "That's proper teamwork. How are you feeling tonight?", timestamp: ts(8, 4) },
          { role: 'user' as const, text: "Bit tired. But okay. Just want to keep the momentum going.", timestamp: ts(8, 5) },
          { role: 'agent' as const, text: "You're doing brilliantly. Rest up and keep going tomorrow.", timestamp: ts(8, 6) },
        ],
        insights: {
          mood: { score: 5, label: 'okay', description: 'Steady day with continued job search efforts' },
          summary: "Had a quiet day but kept productive. Applied for a couple more jobs online — the forms are a pain but Marcus helped me with my email. Feeling tired but want to keep the momentum going.",
          themes: ['job search', 'persistence', 'peer support'],
          wins: ['Applied for jobs', 'Got help from Marcus'],
          struggles: ['Feeling tired', 'Job forms are difficult'],
          people_mentioned: ['Marcus'],
          looking_forward_to: 'Keeping momentum going',
          concern_level: 'none',
          conversation_quality: { openness: 3, duration_feel: 'moderate', engagement: 'moderate' },
        },
      },
      // Day 8 — BAD DAY, mood 3
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(7),
        conversationId: 'el_conv_jay_08', durationSecs: 210,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(7, 0) },
          { role: 'user' as const, text: "Not great to be honest.", timestamp: ts(7, 1) },
          { role: 'agent' as const, text: "I'm sorry to hear that. Do you want to talk about what happened?", timestamp: ts(7, 2) },
          { role: 'user' as const, text: "My daughter's birthday is tomorrow and I can't see her. Her mum won't let me. It just... hit me today.", timestamp: ts(7, 3) },
          { role: 'agent' as const, text: "That sounds really tough, Jay. Missing something like that — that's hard.", timestamp: ts(7, 4) },
          { role: 'user' as const, text: "Yeah. I just sat in my room most of the day. Didn't really feel like doing anything. Feel like I've let everyone down.", timestamp: ts(7, 5) },
          { role: 'agent' as const, text: "I hear you. Those feelings are really heavy. But you're here, you're trying. That counts for something, you know?", timestamp: ts(7, 6) },
          { role: 'user' as const, text: "I suppose. I just miss her.", timestamp: ts(7, 7) },
          { role: 'agent' as const, text: "Of course you do. Maybe you could write her a card or something — when you're ready. Is there anyone you can talk to about this?", timestamp: ts(7, 8) },
          { role: 'user' as const, text: "Yeah. My key worker said I can talk to her anytime. I might do that tomorrow.", timestamp: ts(7, 9) },
          { role: 'agent' as const, text: "That sounds like a good plan. You've been really honest tonight and that takes a lot. Try to get some sleep, yeah?", timestamp: ts(7, 10) },
        ],
        insights: {
          mood: { score: 3, label: 'low', description: 'Really struggling with missing daughter on her birthday' },
          summary: "Tough day today. My daughter's birthday is tomorrow and I can't see her — her mum won't let me. I just sat in my room most of the day feeling like I've let everyone down. Might talk to my key worker about it tomorrow.",
          themes: ['loneliness', 'missing family', 'guilt', 'sadness'],
          wins: ['Being honest about feelings', 'Has plan to talk to key worker'],
          struggles: ["Can't see daughter on her birthday", 'Feeling like a failure', 'Withdrew to room all day'],
          people_mentioned: ['daughter', 'key worker'],
          looking_forward_to: 'Talking to key worker',
          concern_level: 'moderate',
          conversation_quality: { openness: 5, duration_feel: 'extended', engagement: 'high' },
        },
      },
      // Day 7 — recovery, mood 5
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(6),
        conversationId: 'el_conv_jay_09', durationSecs: 170,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(6, 0) },
          { role: 'user' as const, text: "Better than yesterday. Talked to my key worker this morning like I said I would.", timestamp: ts(6, 1) },
          { role: 'agent' as const, text: "Well done for following through on that. How was it?", timestamp: ts(6, 2) },
          { role: 'user' as const, text: "Really helpful actually. She said she can help me sort out supervised contact. So there might be a way to see my girl.", timestamp: ts(6, 3) },
          { role: 'agent' as const, text: "That's really positive news, Jay. That must feel like a weight off.", timestamp: ts(6, 4) },
          { role: 'user' as const, text: "Yeah a bit. Marcus also checked in on me which was nice. Made me a brew and just sat with me for a bit.", timestamp: ts(6, 5) },
          { role: 'agent' as const, text: "That's what good people do. Sounds like you've got some solid support around you. Rest well tonight.", timestamp: ts(6, 6) },
        ],
        insights: {
          mood: { score: 5, label: 'okay', description: 'Recovering from tough day, found hope through key worker support' },
          summary: "Better day today. Talked to my key worker about seeing my daughter and she said she can help sort out supervised contact. Marcus checked in on me too and made me a brew. Feeling a bit more hopeful.",
          themes: ['recovery', 'support', 'family hope', 'peer support'],
          wins: ['Spoke to key worker', 'Possible path to seeing daughter', 'Marcus checked in'],
          struggles: ['Still processing yesterday'],
          people_mentioned: ['key worker', 'Marcus', 'daughter'],
          looking_forward_to: 'Supervised contact with daughter',
          concern_level: 'mild',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 6 — mood 6
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(5),
        conversationId: 'el_conv_jay_10', durationSecs: 155,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(5, 0) },
          { role: 'user' as const, text: "Good day actually. Got the call about forklift training — I start next Monday!", timestamp: ts(5, 1) },
          { role: 'agent' as const, text: "Oh that's brilliant! How are you feeling about it?", timestamp: ts(5, 2) },
          { role: 'user' as const, text: "Nervous but excited. It's been ages since I've done any proper training. But it's a real opportunity.", timestamp: ts(5, 3) },
          { role: 'agent' as const, text: "It really is. Something concrete to work towards. What else happened today?", timestamp: ts(5, 4) },
          { role: 'user' as const, text: "Went for a walk with Danny, the new lad. Showed him around the area. Felt good to help someone else out.", timestamp: ts(5, 5) },
          { role: 'agent' as const, text: "Look at you, already paying it forward. Really nice day, Jay. Well done.", timestamp: ts(5, 6) },
        ],
        insights: {
          mood: { score: 6, label: 'good', description: 'Excited about forklift training and enjoying helping others' },
          summary: "Great day — got the call about forklift training and I start next Monday! Feeling nervous but excited. Also went for a walk with Danny, the new lad, and showed him around. Felt good to help someone else.",
          themes: ['job progress', 'helping others', 'excitement'],
          wins: ['Got confirmed for forklift training', 'Helped new resident Danny', 'Being a mentor'],
          struggles: ['Nervous about training'],
          people_mentioned: ['Danny'],
          looking_forward_to: 'Starting forklift training on Monday',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 5 — mood 6
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(4),
        conversationId: 'el_conv_jay_11', durationSecs: 148,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(4, 0) },
          { role: 'user' as const, text: "Decent. Prepped a bit for the training — looked up some stuff about forklifts online. Watched some videos.", timestamp: ts(4, 1) },
          { role: 'agent' as const, text: "That's smart, getting a head start. How was the rest of the day?", timestamp: ts(4, 2) },
          { role: 'user' as const, text: "We all had dinner together tonight. Lisa cooked. It was actually really nice, felt like a proper household.", timestamp: ts(4, 3) },
          { role: 'agent' as const, text: "That sounds lovely. Community dinners hit different, don't they? How are you feeling?", timestamp: ts(4, 4) },
          { role: 'user' as const, text: "Good actually. Like things are coming together a bit. Still a long way to go but... yeah, good.", timestamp: ts(4, 5) },
          { role: 'agent' as const, text: "You should feel good. You've got real momentum going. Sleep well, Jay.", timestamp: ts(4, 6) },
        ],
        insights: {
          mood: { score: 6, label: 'good', description: 'Feeling positive about building momentum and community' },
          summary: "Good day today. Did some prep for the forklift training — watched videos and looked stuff up online. We all had dinner together tonight, Lisa cooked, and it felt like a proper household. Things are coming together.",
          themes: ['preparation', 'community', 'belonging'],
          wins: ['Prepped for training', 'Group dinner together', 'Feeling part of community'],
          struggles: [],
          people_mentioned: ['Lisa'],
          looking_forward_to: 'Forklift training',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 4 — mood 7
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(3),
        conversationId: 'el_conv_jay_12', durationSecs: 190,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(3, 0) },
          { role: 'user' as const, text: "Really good actually! First day of forklift training.", timestamp: ts(3, 1) },
          { role: 'agent' as const, text: "Oh brilliant! How did it go?", timestamp: ts(3, 2) },
          { role: 'user' as const, text: "Loved it. The instructor was proper sound and I picked it up quicker than I thought. Even got to drive one in the afternoon.", timestamp: ts(3, 3) },
          { role: 'agent' as const, text: "That's amazing! Sounds like you're a natural. How did that feel?", timestamp: ts(3, 4) },
          { role: 'user' as const, text: "Honestly? Best I've felt in months. Like I'm actually doing something with my life again. The other people on the course were sound too.", timestamp: ts(3, 5) },
          { role: 'agent' as const, text: "Jay, that's really something. You should be proper proud of yourself. What a day.", timestamp: ts(3, 6) },
          { role: 'user' as const, text: "Yeah I am actually. For once.", timestamp: ts(3, 7) },
          { role: 'agent' as const, text: "Hold onto that feeling. You've earned it. Rest up for day two tomorrow!", timestamp: ts(3, 8) },
        ],
        insights: {
          mood: { score: 7, label: 'good', description: 'Feeling genuinely proud and energised after first day of forklift training' },
          summary: "Brilliant day — first day of forklift training and I loved it! Picked it up quicker than I thought and even got to drive one in the afternoon. The instructor and other people were sound. Best I've felt in months.",
          themes: ['achievement', 'confidence', 'new skills', 'pride'],
          wins: ['Started forklift training', 'Picked up skills quickly', 'Drove a forklift', 'Feeling proud'],
          struggles: [],
          people_mentioned: ['training instructor'],
          looking_forward_to: 'Day two of training',
          concern_level: 'none',
          conversation_quality: { openness: 5, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 3 — mood 7
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(2),
        conversationId: 'el_conv_jay_13', durationSecs: 165,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(2, 0) },
          { role: 'user' as const, text: "Another good one. Training went well again. Started doing the health and safety theory bit.", timestamp: ts(2, 1) },
          { role: 'agent' as const, text: "Nice, powering through it. How's the course going overall?", timestamp: ts(2, 2) },
          { role: 'user' as const, text: "Really well. The instructor said I'm one of the quickest to pick it up. Felt dead chuffed.", timestamp: ts(2, 3) },
          { role: 'agent' as const, text: "That's well deserved praise. What did you get up to after training?", timestamp: ts(2, 4) },
          { role: 'user' as const, text: "Came home and told Marcus all about it. He said there might be a job going at his mate's warehouse once I'm qualified.", timestamp: ts(2, 5) },
          { role: 'agent' as const, text: "Things are really lining up for you. What a week. Sleep well, Jay.", timestamp: ts(2, 6) },
        ],
        insights: {
          mood: { score: 7, label: 'good', description: 'Growing confidence with training progress and potential job lead' },
          summary: "Another good day of training — the instructor said I'm one of the quickest to pick it up, which felt amazing. Marcus told me there might be a job going at his mate's warehouse once I'm qualified. Things are really lining up.",
          themes: ['confidence', 'job progress', 'peer support', 'momentum'],
          wins: ['Praised by instructor', 'Potential job lead from Marcus', 'Training going well'],
          struggles: [],
          people_mentioned: ['Marcus', 'training instructor'],
          looking_forward_to: 'Job at warehouse',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      // Day 2 — mood 8
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(1),
        conversationId: 'el_conv_jay_14', durationSecs: 180,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(1, 0) },
          { role: 'user' as const, text: "Mate, today was something else. My key worker rang and said the supervised contact got approved. I'm going to see my daughter next Saturday.", timestamp: ts(1, 1) },
          { role: 'agent' as const, text: "Jay! That's incredible news. How are you feeling?", timestamp: ts(1, 2) },
          { role: 'user' as const, text: "I actually cried a bit if I'm honest. In a good way though. It's been so long. I can't wait to see her face.", timestamp: ts(1, 3) },
          { role: 'agent' as const, text: "That's beautiful, honestly. You must be over the moon.", timestamp: ts(1, 4) },
          { role: 'user' as const, text: "I am. And training is going well too. Two more days and I'll have my licence. It's all happening.", timestamp: ts(1, 5) },
          { role: 'agent' as const, text: "You've worked so hard for all of this. I'm really happy for you. Enjoy this feeling tonight, yeah?", timestamp: ts(1, 6) },
          { role: 'user' as const, text: "Yeah. For the first time in ages, I actually feel like things might be okay.", timestamp: ts(1, 7) },
          { role: 'agent' as const, text: "They really might be, Jay. Sleep well.", timestamp: ts(1, 8) },
        ],
        insights: {
          mood: { score: 8, label: 'great', description: 'Emotional and overjoyed about approved contact with daughter' },
          summary: "What a day. My key worker called and said supervised contact got approved — I'm going to see my daughter next Saturday. I actually cried happy tears. Training is nearly done too, just two more days for my licence. For the first time in ages, I feel like things might be okay.",
          themes: ['family reunion', 'joy', 'hope', 'progress'],
          wins: ['Supervised contact approved', 'Will see daughter next Saturday', 'Nearly finished training', 'Emotional breakthrough'],
          struggles: [],
          people_mentioned: ['key worker', 'daughter'],
          looking_forward_to: 'Seeing daughter next Saturday',
          concern_level: 'none',
          conversation_quality: { openness: 5, duration_feel: 'extended', engagement: 'high' },
        },
      },
      // Day 1 (today) — mood 8
      {
        userId: jay._id, userName: 'Jay', date: daysAgo(0),
        conversationId: 'el_conv_jay_15', durationSecs: 195,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(0, 0) },
          { role: 'user' as const, text: "Amazing. I passed the forklift assessment! Got my licence!", timestamp: ts(0, 1) },
          { role: 'agent' as const, text: "Jay! That's absolutely brilliant! How does it feel?", timestamp: ts(0, 2) },
          { role: 'user' as const, text: "Unreal. Everyone at the house gave me a clap when I told them. Marcus got me a card and everything. Even Danny wrote in it.", timestamp: ts(0, 3) },
          { role: 'agent' as const, text: "That's so lovely. Your housemates really showed up for you. What a moment.", timestamp: ts(0, 4) },
          { role: 'user' as const, text: "Yeah. And Marcus's mate confirmed there's a trial shift at the warehouse next week. So I might actually have a job soon.", timestamp: ts(0, 5) },
          { role: 'agent' as const, text: "Look at you. Forklift licence, job trial, seeing your daughter on Saturday. Jay, you're absolutely smashing it.", timestamp: ts(0, 6) },
          { role: 'user' as const, text: "I know, right? Two weeks ago I was sat in my room not knowing what to do with myself. Now look at me.", timestamp: ts(0, 7) },
          { role: 'agent' as const, text: "You should be so proud. What an incredible journey. Rest up — you've got a big week ahead.", timestamp: ts(0, 8) },
        ],
        insights: {
          mood: { score: 8, label: 'great', description: 'Overjoyed and proud after passing forklift assessment' },
          summary: "I passed my forklift assessment today! Everyone at the house clapped and Marcus got me a card. There's a trial shift at the warehouse next week too. Two weeks ago I didn't know what to do with myself — now I've got my licence, a job trial, and I'm seeing my daughter on Saturday.",
          themes: ['achievement', 'community', 'confidence', 'looking forward'],
          wins: ['Passed forklift assessment', 'Got forklift licence', 'Trial shift confirmed', 'Celebrated by housemates'],
          struggles: [],
          people_mentioned: ['Marcus', 'Danny', 'daughter'],
          looking_forward_to: 'Warehouse trial shift and seeing daughter on Saturday',
          concern_level: 'none',
          conversation_quality: { openness: 5, duration_feel: 'extended', engagement: 'high' },
        },
      },
    ];

    // --- MARCUS (thriving) ---
    const marcusEntries = [
      {
        userId: marcus._id, userName: 'Marcus', date: daysAgo(4),
        conversationId: 'el_conv_marcus_01', durationSecs: 160,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(4, 0) },
          { role: 'user' as const, text: "Yeah good mate. Work was busy but I like it that way. Time flies.", timestamp: ts(4, 1) },
          { role: 'agent' as const, text: "Keeping busy is good. What do you do?", timestamp: ts(4, 2) },
          { role: 'user' as const, text: "I'm at the recycling centre. It's physical but honest work. My supervisor said I might get made permanent next month.", timestamp: ts(4, 3) },
          { role: 'agent' as const, text: "That's brilliant news! How does that feel?", timestamp: ts(4, 4) },
          { role: 'user' as const, text: "Means a lot. Stability, you know? First time in a long time.", timestamp: ts(4, 5) },
        ],
        insights: {
          mood: { score: 7, label: 'good', description: 'Feeling stable and valued at work with permanent job prospect' },
          summary: "Good busy day at the recycling centre. My supervisor said I might get made permanent next month which means a lot — first time I've had real stability in ages.",
          themes: ['work stability', 'confidence', 'progress'],
          wins: ['Potential permanent position', 'Good work ethic noted'],
          struggles: [],
          people_mentioned: ['supervisor'],
          looking_forward_to: 'Permanent position',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
      {
        userId: marcus._id, userName: 'Marcus', date: daysAgo(3),
        conversationId: 'el_conv_marcus_02', durationSecs: 145,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(3, 0) },
          { role: 'user' as const, text: "Great actually. Jay started his forklift training today and was proper buzzing when he got back. Nice to see.", timestamp: ts(3, 1) },
          { role: 'agent' as const, text: "That's lovely that you notice and care about that. How was your day though?", timestamp: ts(3, 2) },
          { role: 'user' as const, text: "Work was fine. But yeah, I like looking out for people here. Reminds me why I'm doing all this.", timestamp: ts(3, 3) },
        ],
        insights: {
          mood: { score: 8, label: 'great', description: 'Feeling fulfilled by supporting housemates and having purpose' },
          summary: "Good day at work and loved seeing Jay buzzing about his forklift training. I like looking out for people here — it reminds me why I'm doing all this.",
          themes: ['helping others', 'purpose', 'community'],
          wins: ['Supporting Jay', 'Finding purpose in community'],
          struggles: [],
          people_mentioned: ['Jay'],
          looking_forward_to: null,
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'brief', engagement: 'high' },
        },
      },
      {
        userId: marcus._id, userName: 'Marcus', date: daysAgo(2),
        conversationId: 'el_conv_marcus_03', durationSecs: 135,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(2, 0) },
          { role: 'user' as const, text: "Yeah solid. Spoke to my mate about getting Jay a trial shift at the warehouse. He said yeah, so that's sorted.", timestamp: ts(2, 1) },
          { role: 'agent' as const, text: "You're a proper connector. That's going to mean a lot to Jay.", timestamp: ts(2, 2) },
          { role: 'user' as const, text: "Hope so. We all need a break sometimes, don't we?", timestamp: ts(2, 3) },
        ],
        insights: {
          mood: { score: 7, label: 'good', description: 'Feeling good about helping Jay and connecting people' },
          summary: "Sorted out a trial shift for Jay at my mate's warehouse today. Feels good to help — we all need a break sometimes.",
          themes: ['helping others', 'generosity', 'networking'],
          wins: ['Arranged trial shift for Jay', 'Using connections positively'],
          struggles: [],
          people_mentioned: ['Jay'],
          looking_forward_to: null,
          concern_level: 'none',
          conversation_quality: { openness: 3, duration_feel: 'brief', engagement: 'moderate' },
        },
      },
      {
        userId: marcus._id, userName: 'Marcus', date: daysAgo(1),
        conversationId: 'el_conv_marcus_04', durationSecs: 155,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(1, 0) },
          { role: 'user' as const, text: "Yeah good. Got a call from my mum today which was nice. She's doing well.", timestamp: ts(1, 1) },
          { role: 'agent' as const, text: "That's lovely. How did that make you feel?", timestamp: ts(1, 2) },
          { role: 'user' as const, text: "Really good. She said she's proud of me. First time she's said that in years.", timestamp: ts(1, 3) },
        ],
        insights: {
          mood: { score: 8, label: 'great', description: 'Emotional and happy after mum said she is proud' },
          summary: "Got a call from my mum today. She said she's proud of me — first time in years. Means everything.",
          themes: ['family connection', 'pride', 'emotional milestone'],
          wins: ['Mum said she is proud', 'Family reconnection'],
          struggles: [],
          people_mentioned: ['mum'],
          looking_forward_to: null,
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'brief', engagement: 'high' },
        },
      },
      {
        userId: marcus._id, userName: 'Marcus', date: daysAgo(0),
        conversationId: 'el_conv_marcus_05', durationSecs: 170,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(0, 0) },
          { role: 'user' as const, text: "Brilliant. Jay passed his forklift test today — got him a card and everything. The whole house celebrated.", timestamp: ts(0, 1) },
          { role: 'agent' as const, text: "That's amazing. Sounds like a proper household moment.", timestamp: ts(0, 2) },
          { role: 'user' as const, text: "It was. Work was good too. Supervisor confirmed I'm going permanent from next month. Officially.", timestamp: ts(0, 3) },
        ],
        insights: {
          mood: { score: 8, label: 'great', description: 'Double celebration — Jay passed and permanent job confirmed' },
          summary: "What a day. Jay passed his forklift test and the whole house celebrated — I got him a card. Then my supervisor confirmed I'm going permanent from next month. Officially.",
          themes: ['celebration', 'community', 'job security'],
          wins: ['Permanent job confirmed', 'Celebrated Jay\'s success', 'Strong household bond'],
          struggles: [],
          people_mentioned: ['Jay', 'Danny', 'supervisor'],
          looking_forward_to: 'Starting permanent position',
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'moderate', engagement: 'high' },
        },
      },
    ];

    // --- LISA (variable) ---
    const lisaEntries = [
      {
        userId: lisa._id, userName: 'Lisa', date: daysAgo(6),
        conversationId: 'el_conv_lisa_01', durationSecs: 180,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(6, 0) },
          { role: 'user' as const, text: "Up and down really. Had a good morning — went to my support group. But then got a letter about my benefits and it stressed me right out.", timestamp: ts(6, 1) },
          { role: 'agent' as const, text: "That sounds like a mixed day. The support group sounds positive though — how was that?", timestamp: ts(6, 2) },
          { role: 'user' as const, text: "Yeah it was good. Nice to talk to people who get it, you know?", timestamp: ts(6, 3) },
        ],
        insights: {
          mood: { score: 5, label: 'mixed', description: 'Good morning at support group but stressed by benefits letter' },
          summary: "Up and down day. Support group was good this morning — nice to talk to people who get it. But a letter about my benefits stressed me out in the afternoon.",
          themes: ['anxiety', 'support network', 'admin stress'],
          wins: ['Attended support group', 'Connected with peers'],
          struggles: ['Benefits letter stress'],
          people_mentioned: [],
          looking_forward_to: null,
          concern_level: 'mild',
          conversation_quality: { openness: 3, duration_feel: 'moderate', engagement: 'moderate' },
        },
      },
      {
        userId: lisa._id, userName: 'Lisa', date: daysAgo(4),
        conversationId: 'el_conv_lisa_02', durationSecs: 140,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(4, 0) },
          { role: 'user' as const, text: "Actually good! Cooked dinner for everyone tonight. Made a curry from scratch.", timestamp: ts(4, 1) },
          { role: 'agent' as const, text: "That's amazing! How did it go down?", timestamp: ts(4, 2) },
          { role: 'user' as const, text: "Everyone loved it. Jay had seconds! It felt really nice to do something for others.", timestamp: ts(4, 3) },
        ],
        insights: {
          mood: { score: 7, label: 'good', description: 'Feeling proud and connected after cooking for housemates' },
          summary: "Great day! Cooked a curry from scratch for everyone and they all loved it — Jay even had seconds. Felt really nice to do something for others.",
          themes: ['cooking', 'community', 'pride', 'generosity'],
          wins: ['Cooked dinner for the house', 'Everyone enjoyed it'],
          struggles: [],
          people_mentioned: ['Jay'],
          looking_forward_to: null,
          concern_level: 'none',
          conversation_quality: { openness: 4, duration_feel: 'brief', engagement: 'high' },
        },
      },
      {
        userId: lisa._id, userName: 'Lisa', date: daysAgo(2),
        conversationId: 'el_conv_lisa_03', durationSecs: 165,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(2, 0) },
          { role: 'user' as const, text: "Not the best. Didn't sleep well last night so everything felt harder today.", timestamp: ts(2, 1) },
          { role: 'agent' as const, text: "Sorry to hear that. Lack of sleep makes everything harder. Did you manage to do anything today?", timestamp: ts(2, 2) },
          { role: 'user' as const, text: "Just basics. But I did manage to ring about that volunteering thing my key worker mentioned. So that's something.", timestamp: ts(2, 3) },
        ],
        insights: {
          mood: { score: 4, label: 'low', description: 'Tired and struggling but managed to make an important phone call' },
          summary: "Not great today — didn't sleep well so everything felt harder. But I did manage to ring about the volunteering thing my key worker mentioned, so that's something.",
          themes: ['fatigue', 'small wins', 'persistence'],
          wins: ['Made phone call about volunteering'],
          struggles: ['Poor sleep', 'Low energy'],
          people_mentioned: ['key worker'],
          looking_forward_to: 'Volunteering opportunity',
          concern_level: 'mild',
          conversation_quality: { openness: 3, duration_feel: 'brief', engagement: 'moderate' },
        },
      },
      {
        userId: lisa._id, userName: 'Lisa', date: daysAgo(0),
        conversationId: 'el_conv_lisa_04', durationSecs: 150,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(0, 0) },
          { role: 'user' as const, text: "Better today. Slept properly. And Jay passed his forklift thing so we all celebrated. Was lovely.", timestamp: ts(0, 1) },
          { role: 'agent' as const, text: "Good sleep makes such a difference. And what a nice thing to celebrate together.", timestamp: ts(0, 2) },
          { role: 'user' as const, text: "Yeah. Makes me think maybe I should look into a course too. Something creative maybe.", timestamp: ts(0, 3) },
        ],
        insights: {
          mood: { score: 6, label: 'good', description: 'Rested and inspired by housemate\'s achievement' },
          summary: "Better day — slept properly at last. Celebrated Jay passing his forklift test with everyone. It's got me thinking about doing a course myself, something creative maybe.",
          themes: ['rest', 'inspiration', 'community', 'future plans'],
          wins: ['Slept well', 'Celebrated with housemates', 'Thinking about own goals'],
          struggles: [],
          people_mentioned: ['Jay'],
          looking_forward_to: 'Looking into a creative course',
          concern_level: 'none',
          conversation_quality: { openness: 3, duration_feel: 'brief', engagement: 'moderate' },
        },
      },
    ];

    // --- DANNY (just starting) ---
    const dannyEntries = [
      {
        userId: danny._id, userName: 'Danny', date: daysAgo(2),
        conversationId: 'el_conv_danny_01', durationSecs: 110,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(2, 0) },
          { role: 'user' as const, text: "Alright. Yeah. Quiet.", timestamp: ts(2, 1) },
          { role: 'agent' as const, text: "Quiet days are okay. Anything happen that stood out?", timestamp: ts(2, 2) },
          { role: 'user' as const, text: "Jay took me for a walk around the area. Showed me where the shops are and that.", timestamp: ts(2, 3) },
          { role: 'agent' as const, text: "That's nice of him. How are you finding the place?", timestamp: ts(2, 4) },
          { role: 'user' as const, text: "It's okay. Different. I'll get used to it.", timestamp: ts(2, 5) },
        ],
        insights: {
          mood: { score: 4, label: 'okay', description: 'Quiet and reserved, still adjusting to new environment' },
          summary: "Quiet day. Jay showed me around the area which was nice. The place is okay, different. I'll get used to it.",
          themes: ['adjusting', 'quiet', 'new environment'],
          wins: ['Went for walk with Jay', 'Getting oriented'],
          struggles: ['Still adjusting'],
          people_mentioned: ['Jay'],
          looking_forward_to: null,
          concern_level: 'mild',
          conversation_quality: { openness: 2, duration_feel: 'brief', engagement: 'minimal' },
        },
      },
      {
        userId: danny._id, userName: 'Danny', date: daysAgo(1),
        conversationId: 'el_conv_danny_02', durationSecs: 120,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(1, 0) },
          { role: 'user' as const, text: "Bit better. Spoke to my key worker about getting on the housing list properly.", timestamp: ts(1, 1) },
          { role: 'agent' as const, text: "That's a good step. How did it go?", timestamp: ts(1, 2) },
          { role: 'user' as const, text: "Okay. Lots of forms but she helped. Said it'll take time but at least it's started.", timestamp: ts(1, 3) },
        ],
        insights: {
          mood: { score: 5, label: 'okay', description: 'Taking small steps forward with housing process' },
          summary: "Bit better today. Spoke to my key worker about the housing list — lots of forms but she helped. It'll take time but at least it's started.",
          themes: ['housing', 'small steps', 'admin'],
          wins: ['Started housing application', 'Got help from key worker'],
          struggles: ['Lots of paperwork'],
          people_mentioned: ['key worker'],
          looking_forward_to: 'Housing progress',
          concern_level: 'none',
          conversation_quality: { openness: 3, duration_feel: 'brief', engagement: 'moderate' },
        },
      },
      {
        userId: danny._id, userName: 'Danny', date: daysAgo(0),
        conversationId: 'el_conv_danny_03', durationSecs: 130,
        transcript: [
          { role: 'agent' as const, text: "Hey, how was your day today?", timestamp: ts(0, 0) },
          { role: 'user' as const, text: "Good actually. Jay passed his test and we all had a bit of a celebration. I signed his card.", timestamp: ts(0, 1) },
          { role: 'agent' as const, text: "That's really lovely that you were part of that. How are you feeling?", timestamp: ts(0, 2) },
          { role: 'user' as const, text: "A bit more like I belong here, to be honest. These lot are alright.", timestamp: ts(0, 3) },
        ],
        insights: {
          mood: { score: 5, label: 'okay', description: 'Starting to feel like he belongs after group celebration' },
          summary: "Good day. Jay passed his test and we all celebrated — I signed his card. Starting to feel a bit more like I belong here. These lot are alright.",
          themes: ['belonging', 'community', 'small steps'],
          wins: ['Participated in group celebration', 'Feeling of belonging growing'],
          struggles: [],
          people_mentioned: ['Jay'],
          looking_forward_to: null,
          concern_level: 'none',
          conversation_quality: { openness: 3, duration_feel: 'brief', engagement: 'moderate' },
        },
      },
    ];

    // Insert all journal entries
    await Journal.insertMany([
      ...jayEntries,
      ...marcusEntries,
      ...lisaEntries,
      ...dannyEntries,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: 4,
        journals: jayEntries.length + marcusEntries.length + lisaEntries.length + dannyEntries.length,
        message: 'Demo data seeded successfully',
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}
