'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import type { IJournal } from '@/lib/types';
import MoodBadge from '@/components/MoodBadge';
import WinsCard from '@/components/WinsCard';
import ThemeTags from '@/components/ThemeTags';

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const [journal, setJournal] = useState<IJournal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await fetch(`/api/journals/${params.id}`);
        const json = await res.json();
        if (json.success) {
          setJournal(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch journal:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchJournal();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen animate-fade-in">
        <div className="animated-gradient h-36 lg:h-44" />
        <div className="max-w-5xl mx-auto px-6 -mt-6 space-y-4">
          <div className="h-16 w-48 rounded-2xl skeleton-shimmer" />
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
            <div className="h-40 rounded-2xl skeleton-shimmer" />
            <div className="h-40 rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-stone-500 text-lg">Journal entry not found.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-teal-600 font-medium hover:underline"
        >
          Go home
        </button>
      </div>
    );
  }

  const { insights } = journal;

  let formattedDate: string;
  try {
    formattedDate = format(parseISO(journal.date), 'EEEE d MMMM yyyy');
  } catch {
    formattedDate = journal.date;
  }

  return (
    <div className="min-h-screen animate-fade-in relative overflow-hidden">
      {/* Header */}
      <header
        className="relative animated-gradient text-white px-6 pt-8 pb-16 lg:pt-10 lg:pb-22 overflow-hidden noise-overlay"
        role="banner"
      >
        <div className="absolute top-0 right-0 w-48 h-48 blob bg-white/8" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="text-white/60 hover:text-white transition-colors p-2 -ml-2 rounded-xl focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <time className="text-white/50 text-xs md:text-sm font-medium" dateTime={journal.date}>
              {formattedDate}
            </time>
            <div className="w-9" />
          </div>
          <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-medium">
            Journal Entry
          </p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">
            {journal.userName}&apos;s Day
          </h1>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 -mt-10 pb-12 space-y-6" role="main">
        {/* 2-column on desktop */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-5 lg:space-y-0">
          {/* Left: Mood + Summary */}
          <div className="lg:col-span-2 space-y-5">
            <section aria-label="Mood" className="animate-fade-in-up">
              <MoodBadge
                score={insights.mood.score}
                label={insights.mood.label}
                size="lg"
              />
            </section>

            {/* Summary */}
            <section
              className="relative overflow-hidden glass-strong rounded-2xl p-6 lg:p-8 shadow-md animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
              aria-label="Journal summary"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 via-teal-500 to-cyan-400 rounded-l-2xl" />
              <p className="text-stone-700 text-base md:text-lg lg:text-xl leading-relaxed italic pl-4">
                &ldquo;{insights.summary}&rdquo;
              </p>
            </section>

            {/* Struggles */}
            {insights.struggles && insights.struggles.length > 0 && (
              <section
                className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-200/60 rounded-2xl p-5 shadow-sm animate-fade-in-up"
                style={{ animationDelay: '0.15s' }}
                aria-label="Things on your mind"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-bl-full" aria-hidden="true" />
                <h3 className="text-sm md:text-base font-bold text-orange-700 flex items-center gap-2 mb-3">
                  <span className="text-lg" aria-hidden="true">💭</span>
                  On your mind
                </h3>
                <ul className="space-y-2" role="list">
                  {insights.struggles.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm md:text-base text-orange-800"
                    >
                      <span className="text-orange-400 mt-1 shrink-0" aria-hidden="true">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <WinsCard wins={insights.wins} />
            </div>

            <section className="glass-strong rounded-2xl p-5 shadow-md animate-fade-in-up" style={{ animationDelay: '0.25s' }} aria-label="Themes">
              <h3 className="text-sm md:text-base font-bold text-stone-600 mb-3">Themes</h3>
              <ThemeTags themes={insights.themes} />
            </section>

            {insights.looking_forward_to && (
              <section
                className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 border border-teal-200/60 rounded-2xl p-5 shadow-sm animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
                aria-label="Looking forward to"
              >
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-teal-200/30 to-transparent rounded-tl-full" aria-hidden="true" />
                <p className="text-sm md:text-base text-teal-700">
                  <span className="font-bold">Looking forward to:</span>{' '}
                  {insights.looking_forward_to}
                </p>
              </section>
            )}

            {insights.people_mentioned && insights.people_mentioned.length > 0 && (
              <div className="glass-strong rounded-2xl p-5 shadow-md animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <p className="text-xs text-stone-400 font-semibold mb-2 uppercase tracking-wider">People mentioned</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {insights.people_mentioned.map((p) => (
                    <span
                      key={p}
                      className="text-xs bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-200/60 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transcript */}
        {journal.transcript && journal.transcript.length > 0 && (
          <div>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-2 text-sm md:text-base text-stone-500 hover:text-stone-700 transition-colors font-semibold py-2 rounded-lg focus-visible:outline-2 focus-visible:outline-teal-500"
              aria-expanded={showTranscript}
              aria-controls="transcript-content"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${showTranscript ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {showTranscript ? 'Hide' : 'View'} full conversation
            </button>

            {showTranscript && (
              <div
                id="transcript-content"
                className="mt-3 glass-strong rounded-2xl p-5 lg:p-6 space-y-4 animate-fade-in-scale shadow-md max-w-3xl"
                role="log"
                aria-label="Full conversation transcript"
              >
                {journal.transcript.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                          isUser
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-br-md'
                            : 'bg-stone-100 text-stone-700 rounded-bl-md'
                        }`}
                      >
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest block mb-0.5 ${
                            isUser ? 'text-teal-100' : 'text-stone-400'
                          }`}
                        >
                          {isUser ? journal.userName : 'MeritMind'}
                        </span>
                        <p className={`text-sm md:text-base leading-relaxed ${isUser ? 'text-white/95' : 'text-stone-700'}`}>
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Duration */}
        {journal.durationSecs > 0 && (
          <p className="text-xs text-stone-400 text-center">
            Conversation lasted{' '}
            {Math.floor(journal.durationSecs / 60)}m{' '}
            {journal.durationSecs % 60}s
          </p>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2 max-w-md mx-auto lg:max-w-lg">
          <button
            onClick={() => router.push('/')}
            className="flex-1 glass-strong text-stone-600 font-medium py-3 lg:py-4 px-4 rounded-2xl hover:bg-white/90 transition-all text-sm md:text-base shadow-sm card-hover focus-visible:outline-2 focus-visible:outline-teal-500"
          >
            Home
          </button>
          <button
            onClick={() => {
              const uid =
                journal.userId ||
                localStorage.getItem('meritmind_userId') ||
                '';
              router.push(`/dashboard?userId=${uid}`);
            }}
            className="flex-1 animated-gradient text-white font-medium py-3 lg:py-4 px-4 rounded-2xl transition-all text-sm md:text-base shadow-md cta-glow active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
          >
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
