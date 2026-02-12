import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { analyzeJournal } from '@/lib/minimax';
import { formatTranscript } from '@/lib/prompts';
import Journal from '@/models/Journal';
import User from '@/models/User';

const TranscriptMessageSchema = z.object({
  role: z.enum(['user', 'agent']),
  text: z.string(),
  timestamp: z.number(),
});

const CreateJournalSchema = z.object({
  userId: z.string().min(1),
  conversationId: z.string().optional().default(''),
  transcript: z.array(TranscriptMessageSchema).min(1),
  durationSecs: z.number().min(0).optional().default(0),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = CreateJournalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { userId, conversationId, transcript, durationSecs } = parsed.data;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Format and analyze transcript with MiniMax
    const formattedTranscript = formatTranscript(transcript);
    const insights = await analyzeJournal(formattedTranscript);

    // Save journal entry
    const today = new Date().toISOString().split('T')[0];
    const journal = await Journal.create({
      userId,
      userName: user.name,
      date: today,
      conversationId,
      durationSecs,
      transcript,
      insights,
    });

    // Update user streak and total
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const hadYesterdayEntry = await Journal.findOne({
      userId,
      date: yesterdayStr,
    });

    if (hadYesterdayEntry) {
      user.currentStreak += 1;
    } else {
      // Check if they already journaled today (re-entry)
      const todayCount = await Journal.countDocuments({ userId, date: today });
      if (todayCount <= 1) {
        user.currentStreak = 1;
      }
    }
    user.totalJournals += 1;
    await user.save();

    return NextResponse.json({ success: true, data: journal });
  } catch (error) {
    console.error('Error creating journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const filter = userId ? { userId } : {};
    const journals = await Journal.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ success: true, data: journals });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journals' },
      { status: 500 }
    );
  }
}
