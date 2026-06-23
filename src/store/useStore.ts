import { create } from 'zustand';

export interface PropertyImage {
  id: string;
  url: string;
  file?: File;
}

export interface PropertyDetails {
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  description: string;
  features: string[];
}

export interface CloverState {
  // Property Data
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: Partial<PropertyDetails>) => void;

  // Images
  images: PropertyImage[];
  setImages: (images: PropertyImage[]) => void;
  addImage: (image: PropertyImage) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;

  // AI Script & Voice
  generatedScript: string;
  setGeneratedScript: (script: string) => void;
  voiceProfile: string;
  setVoiceProfile: (profile: string) => void;
  elevenLabsApiKey: string;
  setElevenLabsApiKey: (key: string) => void;

  // UI State
  isWizardOpen: boolean;
  setWizardOpen: (isOpen: boolean) => void;
  isExporting: boolean;
  setExporting: (isExporting: boolean) => void;
  exportProgress: number;
  setExportProgress: (progress: number) => void;
  videoBlobUrl: string | null;
  setVideoBlobUrl: (url: string | null) => void;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  activeTab: 'demo' | 'examples' | 'my-videos' | 'pricing';
  setActiveTab: (tab: 'demo' | 'examples' | 'my-videos' | 'pricing') => void;
  userProperties: any[];
  addPropertyToList: (property: any) => void;
}

const defaultProperty: PropertyDetails = {
  address: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  description: '',
  features: [],
};

export const useStore = create<CloverState>((set) => ({
  propertyDetails: defaultProperty,
  setPropertyDetails: (details) =>
    set((state) => ({
      propertyDetails: { ...state.propertyDetails, ...details },
    })),

  images: [],
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  reorderImages: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.images);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { images: result };
    }),

  generatedScript: '',
  setGeneratedScript: (script) => set({ generatedScript: script }),
  
  voiceProfile: 'Warm & Inviting (Rachel)',
  setVoiceProfile: (profile) => set({ voiceProfile: profile }),

  elevenLabsApiKey: localStorage.getItem('elevenLabsApiKey') || '',
  setElevenLabsApiKey: (key) => {
    localStorage.setItem('elevenLabsApiKey', key);
    set({ elevenLabsApiKey: key });
  },

  isWizardOpen: false,
  setWizardOpen: (isOpen) => set({ isWizardOpen: isOpen }),

  isExporting: false,
  setExporting: (isExporting) => set({ isExporting }),
  exportProgress: 0,
  setExportProgress: (progress) => set({ exportProgress: progress }),
  videoBlobUrl: null,
  setVideoBlobUrl: (url) => set({ videoBlobUrl: url }),

  isAuthenticated: localStorage.getItem('cloverAuth') === 'true',
  setAuthenticated: (auth) => {
    localStorage.setItem('cloverAuth', auth.toString());
    set({ isAuthenticated: auth });
  },

  activeTab: 'demo',
  setActiveTab: (tab) => set({ activeTab: tab }),

  userProperties: [],
  addPropertyToList: (property) => set((state) => ({ 
    userProperties: [property, ...state.userProperties] 
  })),
}));
