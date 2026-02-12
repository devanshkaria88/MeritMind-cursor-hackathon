import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'ElevenLabs not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: { 'xi-api-key': apiKey },
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: { signedUrl: data.signed_url },
    });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get signed URL' },
      { status: 500 }
    );
  }
}
