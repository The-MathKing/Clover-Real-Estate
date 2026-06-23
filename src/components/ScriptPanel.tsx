import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Square, Volume2, Key } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ScriptPanel: React.FC = () => {
  const { propertyDetails, generatedScript, setGeneratedScript, voiceProfile, setVoiceProfile, elevenLabsApiKey, setElevenLabsApiKey } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

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
      if (voiceProfile.includes('Warm')) {
        script = `Welcome home. Step inside ${address}. ${desc} Every corner of this residence is designed to make you feel comfortable yet pampered, ${featuresText}. Come experience the warmth for yourself.`;
      } else if (voiceProfile.includes('Modern')) {
        script = `Introducing a premier real estate asset at ${address}. Offering a strategic layout, ${desc} This modern workspace and living environment is highly optimized for performance, ${featuresText}. Contact us to arrange a showing.`;
      } else { // Luxury
        script = `Welcome to an architectural masterpiece. Located at the prestigious address of ${address}, this estate defines ultimate luxury. ${desc} Indulge in state-of-the-art living, ${featuresText}. A truly exceptional lifestyle awaits.`;
      }
      
      setGeneratedScript(script);
      setIsGenerating(false);
    }, 1500);
  };

  const stopTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    setIsPlayingTTS(false);
  };

  const playElevenLabsTTS = async () => {
    // Map profiles to ElevenLabs voice IDs
    let voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Default: Bella (Warm)
    if (voiceProfile.includes('Warm')) voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella
    else if (voiceProfile.includes('Modern')) voiceId = 'VR6AewLTigWG4xSOukaG'; // Adam
    else if (voiceProfile.includes('Luxury')) voiceId = 'ThT5KcBeYPX3keUQqHPh'; // Dorothy

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: generatedScript,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from ElevenLabs');
      
      const arrayBuffer = await response.arrayBuffer();
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      audioSourceRef.current = audioContextRef.current.createBufferSource();
      audioSourceRef.current.buffer = audioBuffer;
      audioSourceRef.current.connect(audioContextRef.current.destination);
      
      audioSourceRef.current.onended = () => setIsPlayingTTS(false);
      audioSourceRef.current.start();
    } catch (e) {
      console.error(e);
      alert('Error playing ElevenLabs voice. Check API key.');
      setIsPlayingTTS(false);
    }
  };

  const playBrowserTTS = () => {
    const utterance = new SpeechSynthesisUtterance(generatedScript);
    let selectedVoice: SpeechSynthesisVoice | null = null;
    
    if (voiceProfile.includes('Warm')) {
      selectedVoice = availableVoices.find(v => v.name.includes('Google') || v.name.includes('Samantha')) || null;
      utterance.rate = 0.95; utterance.pitch = 1.05;
    } else if (voiceProfile.includes('Modern')) {
      selectedVoice = availableVoices.find(v => v.name.includes('Daniel') || v.name.includes('Male')) || null;
      utterance.rate = 1.05; utterance.pitch = 0.95;
    } else {
      selectedVoice = availableVoices.find(v => v.name.includes('Serena') || v.name.includes('Karen') || v.name.includes('Google UK English Female')) || null;
      utterance.rate = 0.85; utterance.pitch = 1.0;
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePreviewVoiceover = async () => {
    if (!generatedScript) return;

    if (isPlayingTTS) {
      stopTTS();
      return;
    }

    setIsPlayingTTS(true);

    if (elevenLabsApiKey) {
      await playElevenLabsTTS();
    } else {
      playBrowserTTS();
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopTTS();
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-neutral-500 hover:text-emerald-400 transition-colors"
              title="API Settings"
            >
              <Key className="w-4 h-4" />
            </button>
            <span className="text-xs text-neutral-500 font-medium">BETA</span>
          </div>
        </div>

        {/* API Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              ElevenLabs API Key
            </label>
            <input
              type="password"
              value={elevenLabsApiKey}
              onChange={(e) => setElevenLabsApiKey(e.target.value)}
              placeholder="Paste ElevenLabs key for premium voices"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none transition-colors"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Stored locally. Leave blank to use basic browser voices.
            </p>
          </div>
        )}

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
            <option value="Warm & Inviting (Rachel)">Warm & Inviting (Rachel)</option>
            <option value="Modern & Corporate (Adam)">Modern & Corporate (Adam)</option>
            <option value="Luxury & Sophisticated (Dorothy)">Luxury & Sophisticated (Dorothy)</option>
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
