'use client';

import { useEffect, useRef } from 'react';
import { TranscriptMessage } from '@/lib/types';

interface LiveTranscriptProps {
  messages: TranscriptMessage[];
}

export default function LiveTranscript({ messages }: LiveTranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div
        className="glass rounded-2xl p-6 min-h-[120px] flex items-center justify-center shadow-sm"
        role="log"
        aria-label="Conversation transcript"
        aria-live="polite"
      >
        <p className="text-stone-400 text-sm">
          Your conversation will appear here...
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass-strong rounded-2xl p-5 max-h-[280px] md:max-h-[340px] lg:max-h-[480px] overflow-y-auto shadow-md"
      role="log"
      aria-label="Live conversation transcript"
      aria-live="polite"
    >
      <div className="space-y-3">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={i}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
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
                  {isUser ? 'You' : 'MeritMind'}
                </span>
                <p className={`text-sm md:text-base leading-relaxed ${isUser ? 'text-white/95' : 'text-stone-700'}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
