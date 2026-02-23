import { useEffect, useState } from 'react';

interface EncryptionLoadingModalProps {
  isOpen: boolean;
  onComplete?: () => void;
}

const style = `
  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(30, 58, 138, 0.8);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(30, 58, 138, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(30, 58, 138, 0);
    }
  }

  .animate-pulse-ring {
    animation: pulse-ring 2s infinite;
  }

  .pulse-dot {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.95); }
  }
`;

export function EncryptionLoadingModal({
  isOpen,
  onComplete,
}: EncryptionLoadingModalProps) {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000); // 4 second auto-complete

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % 3);
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{style}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="w-80 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 space-y-6">
          {/* Pulsing Shield Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse-ring">
              <span className="material-symbols-outlined text-4xl text-primary">enhanced_encryption</span>
            </div>
            
            {/* Floating dots around shield */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0, 120, 240].map((angle, idx) => (
                <div
                  key={angle}
                  className="absolute w-2 h-2 bg-primary rounded-full pulse-dot"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-28px)`,
                    opacity: idx === dotIndex ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Headline */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Encrypting &amp; Syncing Data...
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hashing PII via SHA-256 and establishing secure handshake with National Emergency Registry (Firebase).
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === 0
                    ? 'bg-primary'
                    : idx === 1
                    ? 'bg-primary/40'
                    : 'bg-primary/20'
                }`}
              />
            ))}
          </div>

          {/* Optional Cancel button (hidden, auto-completes) */}
          <p className="text-xs text-slate-500 text-center font-medium">
            Securing your dependent's profile...
          </p>
        </div>
      </div>
    </>
  );
}
