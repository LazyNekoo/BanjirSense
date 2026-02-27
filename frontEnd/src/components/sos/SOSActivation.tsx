'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface SOSActivationProps {
  onCancel?: () => void;
  onActivate?: () => void;
  isOpen?: boolean;
}

export const SOSActivation = ({
  onCancel,
  onActivate,
  isOpen = true,
}: SOSActivationProps) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  //const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Handle touch/mouse down
  const handlePressStart = () => {
    setIsHolding(true);
    startTimeRef.current = Date.now();

    const updateProgress = () => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / 3000) * 100, 100);

      setHoldProgress(progress);

      if (progress >= 100) {
        // Trigger activation after 3 seconds
        setIsHolding(false);
        setHoldProgress(0);
        startTimeRef.current = null;
        onActivate?.();
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  // Handle touch/mouse up or leave
  const handlePressEnd = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
    startTimeRef.current = null;
  };

  if (!isOpen) return null;

  // Calculate SVG circle properties
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-0 md:p-4 font-display">
      {/* Main Container */}
      <div className="w-full max-w-[400px] h-[824px] bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-zinc-700 font-display">
        {/* Header */}
        <header className="flex-none px-6 pt-8 pb-4 flex justify-between items-center border-b border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hazard-red/10 flex items-center justify-center text-hazard-red border border-hazard-red/20">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              BanjirSense
            </span>
          </div>
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
          {/* Top Section: Emergency Label */}
          <div className="mb-12 text-center max-w-[280px] flex flex-col items-center">
            <div className="bg-hazard-red/10 p-3 rounded-full border border-hazard-red/20 mb-4">
              <svg
                className="w-8 h-8 text-hazard-red"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h2 className="text-hazard-red font-black uppercase tracking-widest text-xs mb-2">
              Emergency Activation
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Emergency services will be notified immediately upon activation.
            </p>
          </div>

          {/* SOS Button with Progress Ring */}
          <div className="relative flex items-center justify-center mb-12">
            {/* Pulse Ring Animation */}
            <div className="absolute w-48 h-48 rounded-full border-2 border-hazard-red/40 animate-pulse" />
            <div
              className="absolute w-48 h-48 rounded-full border-2 border-hazard-red/40 animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />

            {/* Main SOS Button */}
            <button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-hazard-red to-red-700 shadow-lg flex flex-col items-center justify-center active:scale-95 transition-transform border-4 border-white/20 hover:border-white/30 cursor-pointer"
              style={{
                boxShadow: `0 0 50px 10px ${isHolding ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.4)'}`,
              }}
            >
              <span className="text-6xl font-black text-white tracking-tighter">
                SOS
              </span>
            </button>

            {/* SVG Progress Ring */}
            <svg
              className="absolute w-64 h-64 -rotate-90 pointer-events-none"
              viewBox="0 0 256 256"
            >
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r={radius}
                fill="transparent"
                stroke="rgb(39, 39, 42)"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="128"
                cy="128"
                r={radius}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all"
                style={{ transitionDuration: '0ms' }}
              />
            </svg>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-zinc-300 font-medium text-sm">
                Press and hold for 3 seconds
              </p>
            </div>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">
              to activate emergency rescue
            </p>
          </div>

          {/* Background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-red-900/5 blur-[120px] rounded-full pointer-events-none" />
        </main>

        {/* Footer */}
        <footer className="flex-none p-12 flex flex-col items-center gap-6 border-t border-zinc-800/50">
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
              Secure Government-Linked Encryption
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};