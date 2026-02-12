'use client';

import { Orb, emeraldPreset } from 'react-ai-orb';

export default function ProcessingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-8 overflow-hidden"
      role="alert"
      aria-live="assertive"
      aria-label="Processing your journal entry"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-90" />

      {/* Floating blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 blob bg-teal-300/20" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 blob-slow bg-cyan-300/20" style={{ animationDelay: '2s' }} aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 blob bg-emerald-300/15" style={{ animationDelay: '4s' }} aria-hidden="true" />

      {/* Orb */}
      <div className="relative z-10 animate-fade-in-scale">
        <Orb
          {...emeraldPreset}
          size={1.3}
          animationSpeedBase={1.5}
          mainOrbHueAnimation
        />
      </div>

      <div className="relative z-10 text-center space-y-3 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Processing your journal...
        </h2>
        <p className="text-base md:text-lg text-white/70 max-w-sm">
          Capturing the key moments from your conversation
        </p>
      </div>

      {/* Animated dots */}
      <div className="relative z-10 flex gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-white/80"
            style={{
              animation: `orb-breathe 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
