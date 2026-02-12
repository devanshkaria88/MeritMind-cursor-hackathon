'use client';

import { useMemo } from 'react';
import { Orb } from 'react-ai-orb';
import type { OrbPalette } from 'react-ai-orb';

interface VoiceOrbProps {
  status: 'disconnected' | 'connecting' | 'connected';
  isSpeaking: boolean;
}

const tealPalette: OrbPalette = {
  mainBgStart: 'rgb(13, 148, 136)',
  mainBgEnd: 'rgb(15, 118, 110)',
  shadowColor1: 'rgba(13, 148, 136, 0)',
  shadowColor2: 'rgba(20, 184, 166, 0.15)',
  shadowColor3: 'rgba(13, 148, 136, 0.2)',
  shadowColor4: 'rgba(6, 95, 70, 0.1)',
  shapeAStart: 'rgb(20, 184, 166)',
  shapeAEnd: 'rgb(94, 234, 212)',
  shapeBStart: 'rgb(13, 148, 136)',
  shapeBMiddle: 'rgba(45, 212, 191, 0.6)',
  shapeBEnd: 'rgb(17, 94, 89)',
  shapeCStart: 'rgb(94, 234, 212)',
  shapeCMiddle: 'rgba(20, 184, 166, 0.4)',
  shapeCEnd: 'rgb(15, 118, 110)',
  shapeDStart: 'rgb(45, 212, 191)',
  shapeDMiddle: 'rgba(13, 148, 136, 0)',
  shapeDEnd: '#0f766e',
};

const amberPalette: OrbPalette = {
  mainBgStart: 'rgb(245, 158, 11)',
  mainBgEnd: 'rgb(217, 119, 6)',
  shadowColor1: 'rgba(245, 158, 11, 0)',
  shadowColor2: 'rgba(251, 191, 36, 0.2)',
  shadowColor3: 'rgba(245, 158, 11, 0.25)',
  shadowColor4: 'rgba(180, 83, 9, 0.1)',
  shapeAStart: 'rgb(251, 191, 36)',
  shapeAEnd: 'rgb(253, 224, 71)',
  shapeBStart: 'rgb(245, 158, 11)',
  shapeBMiddle: 'rgba(251, 191, 36, 0.7)',
  shapeBEnd: 'rgb(180, 83, 9)',
  shapeCStart: 'rgb(253, 224, 71)',
  shapeCMiddle: 'rgba(251, 191, 36, 0.5)',
  shapeCEnd: 'rgb(217, 119, 6)',
  shapeDStart: 'rgb(251, 191, 36)',
  shapeDMiddle: 'rgba(245, 158, 11, 0)',
  shapeDEnd: '#b45309',
};

export default function VoiceOrb({ status, isSpeaking }: VoiceOrbProps) {
  const isActive = status === 'connected';
  const isConnecting = status === 'connecting';

  const orbProps = useMemo(() => {
    if (isSpeaking) {
      return {
        palette: amberPalette,
        size: 1.15,
        animationSpeedBase: 2.2,
        animationSpeedHue: 1.8,
        hueRotation: 30,
        mainOrbHueAnimation: true,
        blobAOpacity: 0.5,
        blobBOpacity: 0.9,
      };
    }
    if (isActive) {
      return {
        palette: tealPalette,
        size: 1.05,
        animationSpeedBase: 1.4,
        animationSpeedHue: 1.0,
        hueRotation: 20,
        mainOrbHueAnimation: true,
        blobAOpacity: 0.4,
        blobBOpacity: 0.7,
      };
    }
    if (isConnecting) {
      return {
        palette: tealPalette,
        size: 0.95,
        animationSpeedBase: 1.8,
        animationSpeedHue: 1.5,
        hueRotation: 60,
        mainOrbHueAnimation: true,
        blobAOpacity: 0.3,
        blobBOpacity: 0.5,
      };
    }
    // Idle / disconnected
    return {
      palette: tealPalette,
      size: 1,
      animationSpeedBase: 0.6,
      animationSpeedHue: 0.4,
      hueRotation: 10,
      mainOrbHueAnimation: false,
      blobAOpacity: 0.25,
      blobBOpacity: 0.5,
    };
  }, [isSpeaking, isActive, isConnecting]);

  return (
    <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
      {/* Orb container with smooth CSS transitions */}
      <div
        className="relative flex items-center justify-center transition-transform duration-700 ease-out"
        style={{ transform: `scale(${isSpeaking ? 1.02 : 1})` }}
      >
        {/* Ripple rings (only when active) */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className={`absolute w-64 h-64 rounded-full border ${isSpeaking ? 'border-amber-300/20' : 'border-teal-400/20'} animate-orb-ripple`} />
            <div className={`absolute w-64 h-64 rounded-full border ${isSpeaking ? 'border-amber-300/15' : 'border-teal-400/15'} animate-orb-ripple-delayed`} />
            <div className={`absolute w-64 h-64 rounded-full border ${isSpeaking ? 'border-amber-300/10' : 'border-teal-400/10'} animate-orb-ripple-delayed-2`} />
          </div>
        )}

        {/* Outer spinning ring */}
        {(isActive || isConnecting) && (
          <div
            className="absolute w-72 h-72 rounded-full pointer-events-none animate-orb-ring-reverse"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, ${isSpeaking ? 'rgba(245,158,11,0.15)' : 'rgba(13,148,136,0.15)'} 25%, transparent 50%, ${isSpeaking ? 'rgba(251,191,36,0.1)' : 'rgba(20,184,166,0.1)'} 75%, transparent 100%)`,
              animationDuration: '12s',
            }}
            aria-hidden="true"
          />
        )}

        {/* The Orb */}
        <div className="relative z-10">
          <Orb {...orbProps} />
        </div>
      </div>

      {/* Status label */}
      <p
        className="text-sm md:text-base text-stone-500 font-medium tracking-wide"
        aria-label={getAriaLabel(status, isSpeaking)}
      >
        {getLabel(status, isSpeaking)}
      </p>
    </div>
  );
}

function getLabel(status: string, isSpeaking: boolean): string {
  if (status === 'disconnected') return 'Tap to start';
  if (status === 'connecting') return 'Connecting...';
  if (isSpeaking) return 'MeritMind is speaking...';
  return 'Listening...';
}

function getAriaLabel(status: string, isSpeaking: boolean): string {
  if (status === 'disconnected') return 'Voice journal is idle. Tap to start a conversation.';
  if (status === 'connecting') return 'Connecting to voice agent...';
  if (isSpeaking) return 'MeritMind is currently speaking';
  return 'MeritMind is listening to you';
}
