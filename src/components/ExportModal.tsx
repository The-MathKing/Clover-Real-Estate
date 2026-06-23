import React, { useState } from 'react';
import { X, CheckCircle, Download, Link, Film } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ExportModal: React.FC = () => {
  const { isExporting, setExporting, exportProgress, videoBlobUrl, setVideoBlobUrl, setExportProgress } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isExporting) return null;

  const isFinished = exportProgress >= 100 && videoBlobUrl !== null;

  const handleDownload = () => {
    if (!videoBlobUrl) return;
    const link = document.createElement('a');
    link.href = videoBlobUrl;
    link.download = 'clover_presentation.webm';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setExporting(false);
    setExportProgress(0);
    setVideoBlobUrl(null);
  };

  let statusMessage = 'Initializing WebM rendering engine...';
  if (exportProgress > 0 && exportProgress < 100) {
    statusMessage = `Stitching canvas frames and merging AI Audio...`;
  } else if (isFinished) {
    statusMessage = 'Export Complete!';
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg">
              <Film className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Export Presentation</h3>
              <p className="text-xs text-neutral-450">Real-time local WebM encoding</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300 font-medium">{statusMessage}</span>
                <span className="text-emerald-400 font-bold">{Math.round(exportProgress)}%</span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-850">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
            
            <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-850">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-neutral-550">
                  {exportProgress === 0 ? 'STARTING_MEDIA_RECORDER' : 'ENCODING_VP8_WEBM...'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-full text-emerald-400">
                <CheckCircle className="w-12 h-12" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Your Video is Ready!</h4>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                The property presentation has been fully stitched and encoded to WebM, ready for playback.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Download WebM
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
