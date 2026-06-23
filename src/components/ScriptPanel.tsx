import React, { useState, useEffect } from 'react';
import { Sparkles, Square, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ScriptPanel: React.FC = () => {
  const { propertyDetails, generatedScript, setGeneratedScript, voiceProfile, setVoiceProfile } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Fetch SpeechSynthesis voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setAvailableVoices(window.speechSynthesis.getVoices());
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleGenerateScript = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const address = propertyDetails.address || '124 Bellevue Ave';
      const featuresText = propertyDetails.features && propertyDetails.features.length > 0 
        ? `featuring a magnificent ${propertyDetails.features.slice(0, 2).join(' and a ')}`
        : 'boasting incredible modern refinements';
      const desc = propertyDetails.description || 'This estate defines absolute refinement.';
      
      let script = '';
      if (voiceProfile === 'Warm & Inviting') {
        script = `Welcome home. Step inside ${address}. ${desc} Every corner of this residence is designed to make you feel comfortable yet pampered, ${featuresText}. Come experience the warmth for yourself.`;
      } else if (voiceProfile === 'Modern & Corporate') {
        script = `Introducing a premier real estate asset at ${address}. Offering a strategic layout, ${desc} This modern workspace and living environment is highly optimized for performance, ${featuresText}. Contact us to arrange a showing.`;
      } else { // Luxury & Sophisticated
        script = `Welcome to an architectural masterpiece. Located at the prestigious address of ${address}, this estate defines ultimate luxury. ${desc} Indulge in state-of-the-art living, ${featuresText}. A truly exceptional lifestyle awaits.`;
      }
      
      setGeneratedScript(script);
      setIsGenerating(false);
    }, 1500);
  };

  const handlePreviewVoiceover = () => {
    if (!generatedScript) return;

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(generatedScript);
    
    // Choose appropriate voice based on selected tone
    let selectedVoice: SpeechSynthesisVoice | null = null;
    
    if (voiceProfile === 'Warm & Inviting') {
      // Look for a friendly, warmer sounding voice (e.g. Google US English, Samantha, etc.)
      selectedVoice = availableVoices.find(v => v.name.includes('Google') || v.name.includes('Samantha')) || null;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    } else if (voiceProfile === 'Modern & Corporate') {
      // Professional corporate voice (e.g. Microsoft David, Google UK English Male, Daniel)
      selectedVoice = availableVoices.find(v => v.name.includes('Daniel') || v.name.includes('Male')) || null;
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
    } else { // Luxury & Sophisticated
      // Smooth luxury voice (e.g. Karen, Serena, Google UK Female)
      selectedVoice = availableVoices.find(v => v.name.includes('Serena') || v.name.includes('Karen') || v.name.includes('Google UK English Female')) || null;
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setIsPlayingTTS(false);
    };

    utterance.onerror = () => {
      setIsPlayingTTS(false);
    };

    setIsPlayingTTS(true);
    window.speechSynthesis.speak(utterance);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-full justify-between">
      <div className="space-y-6">
        {/* Title */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            AI Scriptwriter
          </h3>
          <span className="text-xs text-neutral-500 font-medium">BETA</span>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Narrator Tone
          </label>
          <select
            value={voiceProfile}
            onChange={(e) => setVoiceProfile(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 focus:border-emerald-500 rounded-lg px-4 py-3 text-sm text-neutral-300 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="Warm & Inviting">Warm & Inviting</option>
            <option value="Modern & Corporate">Modern & Corporate</option>
            <option value="Luxury & Sophisticated">Luxury & Sophisticated</option>
          </select>
        </div>

        {/* Generator Button */}
        <button
          onClick={handleGenerateScript}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Writing Script...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Narrative Script
            </>
          )}
        </button>

        {/* Script Output Area */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Narration Script
          </label>
          <textarea
            value={generatedScript}
            onChange={(e) => setGeneratedScript(e.target.value)}
            rows={8}
            placeholder="Click 'Generate Narrative Script' or write your own narration script here..."
            className="w-full bg-neutral-950 border border-neutral-850 focus:border-emerald-500 rounded-lg px-4 py-3 text-sm text-neutral-350 placeholder-neutral-600 focus:outline-none transition-colors resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Voiceover preview button */}
      <div className="pt-4 border-t border-neutral-850 mt-6">
        <button
          onClick={handlePreviewVoiceover}
          disabled={!generatedScript}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold transition-all shadow-md ${
            isPlayingTTS 
              ? 'bg-rose-950/30 text-rose-450 border border-rose-800/30 hover:bg-rose-950/50' 
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-205 border border-neutral-700/50 disabled:opacity-50'
          }`}
        >
          {isPlayingTTS ? (
            <>
              <Square className="w-4 h-4 fill-rose-500 text-rose-500" />
              Stop Voiceover Preview
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-500" />
              Preview AI Voiceover
            </>
          )}
        </button>
      </div>
    </div>
  );
};
