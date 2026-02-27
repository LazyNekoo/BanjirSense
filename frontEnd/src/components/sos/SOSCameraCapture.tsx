'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, RefreshCw, Send, Moon, SkipForward } from 'lucide-react';

interface SOSCameraCaptureProps {
  onSkipAndSend?: () => void;
  onSendPhoto?: (photoDataUrl: string) => void;
  occupantCount?: number;
}

export const SOSCameraCapture = ({
  onSkipAndSend,
  onSendPhoto,
  occupantCount = 1,
}: SOSCameraCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isGpsActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 400, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      console.error('Camera access denied or unavailable');
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Capture photo from video
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Send photo
  const handleSendPhoto = () => {
    if (capturedImage && onSendPhoto) {
      onSendPhoto(capturedImage);
    }
  };

  // Initialize camera on mount
  const videoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node && !capturedImage) {
        startCamera();
      }
    },
    [startCamera, capturedImage]
  );

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-0 md:p-4 font-display">
      {/* Main Container — 400×824 */}
      <div className="w-full max-w-[400px] h-[824px] bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border border-zinc-700 font-display">

        {/* Scanline animation overlay */}
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
          <div
            className="w-full h-[2px] absolute"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(239, 68, 68, 0.35), transparent)',
              animation: 'scanline 4s linear infinite',
            }}
          />
        </div>

        {/* ── Header ── */}
        <header className="relative z-20 flex-none px-6 pt-8 pb-4 flex justify-between items-center border-b border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hazard-red/10 flex items-center justify-center text-hazard-red border border-hazard-red/20">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Capture Situation
            </span>
          </div>
          <button
            onClick={onSkipAndSend}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Skip &amp; Send SOS
          </button>
        </header>

        {/* ── Status Pill ── */}
        <div className="relative z-20 flex justify-center pt-4 pb-2">
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isGpsActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'
                }`}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                GPS Lock: {isGpsActive ? 'Active' : 'Searching'}
              </span>
            </div>
            <div className="w-px h-3 bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                Occupants: {occupantCount}
              </span>
            </div>
          </div>
        </div>

        {/* ── Camera Viewfinder / Preview ── */}
        <main className="relative z-10 flex-1 flex flex-col">
          {/* Viewfinder Area */}
          <div className="relative flex-1 mx-4 my-2 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700">
            {/* Live camera or captured preview */}
            {!capturedImage ? (
              <>
                <video
                  ref={videoCallbackRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Fallback placeholder when camera isn't available */}
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/80 pointer-events-none">
                  <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <Camera className="w-12 h-12" />
                    <span className="text-xs font-medium">Connecting to camera...</span>
                  </div>
                </div>
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured situation"
                className="w-full h-full object-cover"
              />
            )}

            {/* Framing Guideline — translucent white rectangle */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/50" />
            </div>

            {/* Side alignment bars */}
            <div className="absolute top-1/2 left-3 -translate-y-1/2 flex flex-col gap-8 opacity-40 pointer-events-none z-10">
              <div className="w-px h-12 bg-white" />
              <div className="w-px h-12 bg-white" />
            </div>
            <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-8 opacity-40 pointer-events-none z-10">
              <div className="w-px h-12 bg-white" />
              <div className="w-px h-12 bg-white" />
            </div>

            {/* Low-light indicator at the top of viewfinder */}
            <div className="absolute top-3 left-0 right-0 flex justify-center z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <Moon className="w-3 h-3 text-yellow-400" />
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                  Low-light mode active
                </span>
              </div>
            </div>

            {/* Sonar grid overlay */}
            {!capturedImage && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20 z-[1]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            )}

            {/* Vision AI analyzing text */}
            {!capturedImage && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-hazard-red animate-spin"
                    style={{ animationDuration: '3s' }}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10" />
                  </svg>
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.15em]">
                    Vision AI: Analyzing depth &amp; hazards...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Instructional text */}
          <div className="px-6 pt-3 pb-2 text-center">
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
              {!capturedImage
                ? 'Take a clear photo of rising water or obstacles'
                : 'Review your capture before sending'}
            </p>
          </div>
        </main>

        {/* ── Capture / Action Controls ── */}
        <footer className="relative z-20 flex-none px-6 pb-8 pt-4 flex flex-col items-center gap-5">
          {!capturedImage ? (
            /* ── Shutter Button (Pre-capture) ── */
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center">
                {/* Outer ring */}
                <div className="absolute w-[96px] h-[96px] rounded-full border-2 border-white/40" />
                {/* Main shutter */}
                <button
                  onClick={handleCapture}
                  className="relative w-20 h-20 rounded-full bg-hazard-red flex items-center justify-center hover:scale-95 active:bg-red-700 transition-all border-4 border-white/10"
                  style={{
                    boxShadow: '0 0 50px 10px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                Center hazard in frame
              </p>
            </div>
          ) : (
            /* ── Post-Capture Actions ── */
            <div className="w-full flex flex-col items-center gap-3">
              <div className="w-full flex gap-3">
                {/* Retake button */}
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </button>
                {/* Send Photo & SOS button */}
                <button
                  onClick={handleSendPhoto}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-hazard-red text-white font-bold text-sm uppercase tracking-wider hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg"
                  style={{
                    boxShadow: '0 0 30px 5px rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <Send className="w-4 h-4" />
                  Send Photo &amp; SOS
                </button>
              </div>
            </div>
          )}

          {/* Security badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
              Secure Government-Linked Encryption
            </span>
          </div>
        </footer>

        {/* Scanline keyframe */}
        <style>{`
          @keyframes scanline {
            0% { top: 0%; }
            100% { top: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};
