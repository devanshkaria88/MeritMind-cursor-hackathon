import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Journal from '@/models/Journal';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const journal = await Journal.findById(id).lean();

    if (!journal) {
      return NextResponse.json(
        { success: false, error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: journal });
  } catch (error) {
    console.error('Error fetching journal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entry' },
      { status: 500 }
    );
  }
}
