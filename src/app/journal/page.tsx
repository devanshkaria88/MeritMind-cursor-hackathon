'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useConversation } from '@elevenlabs/react';
import VoiceOrb from '@/components/VoiceOrb';
import LiveTranscript from '@/components/LiveTranscript';
import ProcessingScreen from '@/components/ProcessingScreen';
import type { TranscriptMessage, IUser } from '@/lib/types';

type SessionPhase = 'idle' | 'active' | 'processing' | 'error';

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-stone-200 animate-pulse" />
        </div>
      }
    >
      <JournalContent />
    </Suspense>
  );
}

function JournalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');

  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [userData, setUserData] = useState<IUser | null>(null);
  const startTimeRef = useRef<number>(0);
  const transcriptRef = useRef<TranscriptMessage[]>([]);
  const phaseRef = useRef<SessionPhase>('idle');
  const processingRef = useRef(false);

  // Fetch user data (chores, traits, name) on mount
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setUserData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const handleEnd = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setPhase('processing');

    const durationSecs = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );

    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conversationId: '',
          transcript: transcriptRef.current,
          durationSecs,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?._id) {
        router.push(`/journal/${json.data._id}`);
      } else {
        console.error('Journal save failed:', json.error);
        router.push('/');
      }
    } catch (err) {
      console.error('Failed to save journal:', err);
      router.push('/');
    } finally {
      processingRef.current = false;
    }
  }, [userId, router]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs connected');
    },
    onDisconnect: () => {
      console.log('ElevenLabs disconnected');
      if (phaseRef.current === 'active') {
        handleEnd();
      }
    },
    onMessage: (msg) => {
      const newMsg: TranscriptMessage = {
        role: msg.source === 'user' ? 'user' : 'agent',
        text: msg.message,
        timestamp: Date.now(),
      };
      setTranscript((prev) => [...prev, newMsg]);
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
    },
  });

  const startSession = async () => {
    try {
      setErrorMsg('');
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch('/api/signed-url');
      const json = await res.json();

      if (!json.success || !json.data?.signedUrl) {
        setErrorMsg(
          'Could not connect to voice agent. Check that ELEVENLABS_API_KEY and NEXT_PUBLIC_AGENT_ID are configured correctly.'
        );
        setPhase('error');
        return;
      }

      // Build dynamic variables for the ElevenLabs agent prompt
      const choresStr = userData?.chores?.length
        ? userData.chores.map((c, i) => `${i + 1}. ${c}`).join('\n')
        : 'No specific chores assigned today.';

      const traitsStr = userData?.traits?.length
        ? userData.traits.map((t) => `- ${t.name}: ${t.notes}`).join('\n')
        : 'No specific concerns flagged.';

      const residentName = userData?.name || 'mate';

      startTimeRef.current = Date.now();
      setPhase('active');
      await conversation.startSession({
        signedUrl: json.data.signedUrl,
        dynamicVariables: {
          resident_name: residentName,
          chores: choresStr,
          monitored_traits: traitsStr,
        },
      });
    } catch (err) {
      console.error('Failed to start session:', err);
      setErrorMsg(
        'Could not start voice session. Please allow microphone access and try again.'
      );
      setPhase('error');
    }
  };

  const endSession = async () => {
    try {
      await conversation.endSession();
    } catch {
      // If endSession fails, still process
    }
    handleEnd();
  };

  if (phase === 'processing') {
    return <ProcessingScreen />;
  }

  const isIdle = phase === 'idle' || phase === 'error';

  return (
    <div className={`min-h-screen flex flex-col animate-fade-in relative overflow-hidden ${
      isIdle ? 'bg-stone-50' : 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
    } transition-colors duration-1000`}>
      {/* Background effects for active session */}
      {!isIdle && (
        <>
          <div className="absolute top-20 -left-32 w-96 h-96 blob bg-teal-500/8" aria-hidden="true" />
          <div className="absolute bottom-20 -right-32 w-80 h-80 blob-slow bg-amber-500/8" style={{ animationDelay: '3s' }} aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-500/5 to-transparent blur-3xl" aria-hidden="true" />
        </>
      )}

      {/* Top bar */}
      <header className="relative max-w-6xl mx-auto w-full px-6 pt-6 pb-2 flex items-center justify-between" role="banner">
        <button
          onClick={() => router.push('/')}
          className={`${isIdle ? 'text-stone-400 hover:text-stone-600' : 'text-white/40 hover:text-white/80'} transition-colors p-2 -ml-2 rounded-xl focus-visible:outline-2 focus-visible:outline-teal-500`}
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className={`text-xs uppercase tracking-[0.2em] font-medium ${isIdle ? 'text-stone-400' : 'text-white/40'}`}>
          {isIdle ? 'Ready to journal' : 'Journaling'}
        </span>
        <div className="w-9" />
      </header>

      {/* Main */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-6 lg:gap-8" role="main">
        {isIdle ? (
          <>
            <div className="text-center space-y-4 max-w-lg">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-stone-800 tracking-tight">
                How was your day?
              </h1>
              <p className="text-stone-500 text-sm md:text-base lg:text-lg leading-relaxed max-w-md mx-auto">
                Tap the orb to start a conversation. Just talk naturally — no typing needed.
              </p>
            </div>

            <button
              onClick={startSession}
              className="focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 rounded-full transition-transform hover:scale-105 active:scale-95"
              aria-label="Start voice journal session"
            >
              <VoiceOrb status="disconnected" isSpeaking={false} />
            </button>

            {phase === 'error' && errorMsg && (
              <div
                className="glass rounded-2xl p-4 max-w-sm text-center animate-fade-in-scale border border-rose-200/50"
                role="alert"
              >
                <p className="text-sm text-rose-700">{errorMsg}</p>
                <button
                  onClick={() => setPhase('idle')}
                  className="mt-2 text-xs text-rose-500 hover:text-rose-700 font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}

            <p className="text-xs text-stone-400 text-center max-w-xs mt-4 leading-relaxed">
              Ensure &quot;client events&quot; are enabled on your ElevenLabs agent&apos;s Advanced tab for live transcript capture.
            </p>
          </>
        ) : (
          /* Active session: orb + transcript */
          <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start lg:justify-center gap-8 lg:gap-12">
            <div className="flex-shrink-0">
              <VoiceOrb
                status={conversation.status === 'connected' ? 'connected' : 'connecting'}
                isSpeaking={conversation.isSpeaking}
              />
            </div>

            <div className="w-full max-w-lg lg:max-w-xl lg:pt-4">
              <LiveTranscript messages={transcript} />
            </div>
          </div>
        )}
      </main>

      {/* Bottom controls */}
      <nav className="relative px-6 pb-8 pt-2 space-y-3 max-w-lg mx-auto w-full" role="navigation">
        {phase === 'active' && (
          <button
            onClick={endSession}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all active:scale-[0.98] text-sm md:text-base border border-white/10 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            aria-label="End journal session"
          >
            End Journal
          </button>
        )}
      </nav>
    </div>
  );
}
