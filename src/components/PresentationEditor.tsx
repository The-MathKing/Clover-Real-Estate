import React, { useEffect } from 'react';
import { ArrowLeft, Film, HelpCircle } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { ScriptPanel } from './ScriptPanel';
import { ExportModal } from './ExportModal';
import type { Property } from '../mockData';
import { useStore } from '../store/useStore';

interface PresentationEditorProps {
  property: Property;
  onBack: () => void;
}

export const PresentationEditor: React.FC<PresentationEditorProps> = ({ property, onBack }) => {
  const { setPropertyDetails, setImages, setGeneratedScript, setExporting } = useStore();

  useEffect(() => {
    // Populate store with the selected property details
    setPropertyDetails({
      address: property.address,
      price: property.price,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      description: property.description,
      features: property.features,
    });

    // Populate timeline with default high-quality unsplash property images for demonstration
    const sampleImages = [
      { id: '1', url: property.coverImage },
      { id: '2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
      { id: '3', url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80' },
      { id: '4', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80' },
    ];
    setImages(sampleImages);

    // Populate script if exists
    if (property.script) {
      setGeneratedScript(property.script);
    } else {
      setGeneratedScript('');
    }
  }, [property]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Editor Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-350 hover:text-white rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-semibold block text-neutral-500 tracking-wider uppercase">
                Presentation Studio
              </span>
              <h2 className="text-lg font-bold font-heading text-white">
                {property.address}
              </h2>
            </div>
          </div>
          
          <button
            onClick={() => setExporting(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.02]"
          >
            <Film className="w-4 h-4" />
            Export Presentation
          </button>
        </div>
      </header>

      {/* Editor Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas Player HUD (Takes 2 columns on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-heading text-white">Cinematic Preview</h3>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <HelpCircle className="w-3.5 h-3.5" />
              Pan & Zoom renders inside browser canvas
            </div>
          </div>
          <VideoPlayer />
        </div>

        {/* AI Scriptwriter Side Panel (Takes 1 column) */}
        <div className="lg:col-span-1 h-full">
          <ScriptPanel />
        </div>
      </main>

      {/* Export Overlay Modal */}
      <ExportModal />
    </div>
  );
};
