import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Download, Link, Film } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ExportModal: React.FC = () => {
  const { isExporting, setExporting } = useStore();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Optimizing high-res textures...');
  const [isFinished, setIsFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isExporting) {
      setProgress(0);
      setIsFinished(false);
      setCopied(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.25; // 8 seconds total (1.25% * 80 intervals of 100ms = 100%)
        
        // Status message triggers
        if (next < 30) {
          setStatusMessage('Optimizing high-res textures...');
        } else if (next >= 30 && next < 70) {
          setStatusMessage('Fusing AI narration audio track...');
        } else if (next >= 70 && next < 100) {
          setStatusMessage('Encoding to MP4 format (1080p)...');
        } else {
          setStatusMessage('Export Complete!');
          setIsFinished(true);
          clearInterval(interval);
          return 100;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isExporting]);

  if (!isExporting) return null;

  const handleDownload = () => {
    // Generate a dummy text blob and download as .mp4
    const blob = new Blob(['Clover AI Stitched Video Placeholder'], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clover_presentation.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg">
              <Film className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Export Presentation</h3>
              <p className="text-xs text-neutral-450">Fusing slides, music, and narration</p>
            </div>
          </div>
          <button
            onClick={() => setExporting(false)}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rendering view */}
        {!isFinished ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300 font-medium">{statusMessage}</span>
                <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-850">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Spinning/progress logs */}
            <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-850">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-neutral-550">
                  {progress < 30 ? 'EXTRACT_TEXTURES_RUNNING' : progress < 70 ? 'WAV_MERGE_IN_PROGRESS' : 'FFMPEG_ENCODE_1080P'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Completion View */
          <div className="space-y-6 py-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-full text-emerald-400">
                <CheckCircle className="w-12 h-12" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Your Video is Ready!</h4>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                The cinematic stitched property presentation has been rendered at 1080p with complete voice narration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Download MP4
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-semibold rounded-lg border border-neutral-700/50 transition-all active:scale-[0.98]"
              >
                <Link className="w-4 h-4 text-emerald-500" />
                {copied ? 'Copied!' : 'Copy Share Link'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
