import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Journal from '@/models/Journal';
import User from '@/models/User';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase();

    const { userId } = await params;
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all journals for this user, most recent first
    const journals = await Journal.find({ userId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    // Build mood trend (last 14 days)
    const moodTrend = journals
      .slice(0, 14)
      .map((j) => ({
        date: j.date,
        score: j.insights.mood.score,
        label: j.insights.mood.label,
      }))
      .reverse();

    // Aggregate themes
    const themeCounts: Record<string, number> = {};
    journals.forEach((j) => {
      j.insights.themes.forEach((theme: string) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });
    const topThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Recent wins (last 5 entries)
    const recentWins = journals
      .slice(0, 5)
      .flatMap((j) => j.insights.wins)
      .slice(0, 10);

    // Recent entries for the list
    const recentEntries = journals.slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        user,
        moodTrend,
        recentEntries,
        topThemes,
        recentWins,
        totalEntries: journals.length,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
