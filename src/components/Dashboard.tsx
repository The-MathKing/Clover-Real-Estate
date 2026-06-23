import React from 'react';
import { Plus, Clock, AlertCircle, CheckCircle, Layers, Video } from 'lucide-react';
import { mockProperties } from '../mockData';
import type { Property } from '../mockData';
import { useStore } from '../store/useStore';

interface DashboardProps {
  onSelectProperty: (property: Property) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectProperty }) => {
  const { setWizardOpen } = useStore();

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-800/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Ready
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-950/50 text-amber-400 border border-amber-800/30">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Processing
          </span>
        );
      case 'Needs Images':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-rose-950/50 text-rose-400 border border-rose-800/30">
            <AlertCircle className="w-3.5 h-3.5" />
            Needs Images
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-650/10 rounded-xl border border-emerald-500/20">
              <Layers className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading tracking-wide">
                CLOVER
              </span>
              <span className="text-xs block text-neutral-400 font-medium tracking-widest uppercase">
                Real Estate Video Suite
              </span>
            </div>
          </div>
          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create Presentation
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Banner Section */}
        <div className="mb-12 relative overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-r from-neutral-900 via-neutral-900/40 to-neutral-900 p-8 md:p-12">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute right-20 bottom-0 w-72 h-72 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-white tracking-tight mb-4">
              Cinematic Video Stitching, Powered by AI
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed mb-6">
              Transform static listings into breathtaking presentations. Select a property to preview Ken Burns style canvas transitions, edit narration scripts, and export 1080p listing reels.
            </p>
          </div>
        </div>

        {/* Listings Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading text-white">Active Properties</h2>
            <span className="text-sm text-neutral-400 font-medium">{mockProperties.length} listings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <div
                key={property.id}
                className="group flex flex-col bg-neutral-900/50 border border-neutral-850 hover:border-neutral-800 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                  <img
                    src={property.coverImage}
                    alt={property.address}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/0 to-neutral-950/30" />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(property.status)}
                  </div>
                  <div className="absolute bottom-4 right-4 text-2xl font-bold font-heading text-white drop-shadow-md">
                    {property.price}
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      {property.address}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                      {property.description}
                    </p>

                    {/* Specifications */}
                    <div className="flex gap-4 mb-6 text-sm text-neutral-300 border-t border-neutral-850 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 font-semibold">{property.beds}</span> Beds
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 font-semibold">{property.baths}</span> Baths
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 font-semibold">{property.sqft}</span> Sq Ft
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => onSelectProperty(property)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold border border-neutral-850 hover:bg-neutral-850 hover:border-neutral-700 transition-all text-neutral-200"
                  >
                    <Video className="w-4 h-4 text-emerald-500" />
                    Open Presentation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
