import React from 'react';
import { Plus, Clock, AlertCircle, CheckCircle, Layers, Video, PlayCircle, Star, Sparkles, Check, Zap } from 'lucide-react';
import { mockProperties } from '../mockData';
import type { Property } from '../mockData';
import { useStore } from '../store/useStore';

interface DashboardProps {
  onSelectProperty: (property: Property) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectProperty }) => {
  const { setWizardOpen, activeTab, setActiveTab, userProperties } = useStore();

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

  const renderPropertyGrid = (properties: Property[], emptyMessage: string) => {
    if (properties.length === 0) {
      return (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Videos Yet</h3>
          <p className="text-neutral-500 mb-6 max-w-md">{emptyMessage}</p>
          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white font-medium border border-neutral-700/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Presentation
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
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
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/90 backdrop-blur sticky top-0 z-50">
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
                B2B Video Engine
              </span>
            </div>
          </div>
          
          {/* Top Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-neutral-900/50 border border-neutral-800 p-1 rounded-xl">
            {(['demo', 'examples', 'my-videos', 'pricing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all capitalize ${
                  activeTab === tab 
                    ? 'bg-neutral-800 text-white shadow-sm' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setWizardOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create Presentation
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* DEMO TAB */}
        {activeTab === 'demo' && (
          <div className="space-y-12">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-10 md:p-16">
              <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Next-Gen Portfolio Software
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-heading text-white tracking-tight mb-6 leading-tight">
                  Automate Cinematic Real Estate Showcases.
                </h1>
                <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                  Clover is the premier B2B SaaS platform for real estate agencies. Instantly transform your static property images into sweeping, AI-narrated video presentations with local, zero-latency WebM encoding.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('examples')}
                    className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    View Example Videos
                  </button>
                  <button 
                    onClick={() => setActiveTab('pricing')}
                    className="px-6 py-3 bg-neutral-800 text-white hover:bg-neutral-750 border border-neutral-700 font-bold rounded-xl transition-colors"
                  >
                    View Pricing
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Video, title: 'Canvas Render Engine', desc: 'Hardware-accelerated Ken Burns transitions and seamless crossfades built purely in the browser.' },
                { icon: Sparkles, title: 'AI Copy & TTS', desc: 'Auto-generate listing copy and synthesize premium photorealistic voices via ElevenLabs integration.' },
                { icon: Zap, title: 'Instant Local Export', desc: 'Bypass server queues. Render true 1080p video blobs directly on the client machine using MediaRecorder.' },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-neutral-900 border border-neutral-850">
                  <div className="w-12 h-12 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXAMPLES TAB */}
        {activeTab === 'examples' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-heading text-white mb-2">Example Videos</h2>
              <p className="text-neutral-400">Curated showcase templates from top-tier agencies.</p>
            </div>
            {renderPropertyGrid(mockProperties, "No examples found.")}
          </div>
        )}

        {/* MY VIDEOS TAB */}
        {activeTab === 'my-videos' && (
          <div>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold font-heading text-white mb-2">My Videos</h2>
                <p className="text-neutral-400">Your personal workspace of generated presentations.</p>
              </div>
              <span className="text-sm font-semibold text-emerald-500 bg-emerald-950/30 px-3 py-1 rounded-lg border border-emerald-500/20">
                {userProperties.length} Projects
              </span>
            </div>
            {renderPropertyGrid(userProperties, "You haven't created any video presentations yet. Click 'Create Presentation' to build your first cinematic showcase.")}
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="max-w-5xl mx-auto py-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-heading text-white mb-4">Transparent Pricing for Agencies</h2>
              <p className="text-neutral-400 max-w-xl mx-auto">Scale your real estate marketing with unlimited HD exports and premium photorealistic AI voices.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Boutique', price: '$49', desc: 'Perfect for solo agents.', features: ['100 HD Exports /mo', 'Standard Browser TTS', '10 Active Properties', 'Email Support'] },
                { name: 'Agency', price: '$149', desc: 'For growing teams.', features: ['Unlimited HD Exports', 'Premium ElevenLabs AI Voices', 'Unlimited Properties', 'White-label Export', 'Priority Support'], popular: true },
                { name: 'Enterprise', price: '$399', desc: 'Custom pipeline solutions.', features: ['API Access', 'Custom Brand Voices', 'SSO Login', 'Dedicated Account Manager'] }
              ].map((tier, i) => (
                <div key={i} className={`relative p-8 rounded-3xl bg-neutral-900 border ${tier.popular ? 'border-emerald-500' : 'border-neutral-800'} flex flex-col`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-neutral-400 mb-6">{tier.desc}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-neutral-500 font-medium">/mo</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold transition-all ${tier.popular ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}`}>
                    Choose {tier.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
