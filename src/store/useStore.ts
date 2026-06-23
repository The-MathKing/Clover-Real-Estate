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

  // UI State
  isWizardOpen: boolean;
  setWizardOpen: (isOpen: boolean) => void;
  isExporting: boolean;
  setExporting: (isExporting: boolean) => void;
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
  
  voiceProfile: 'Warm & Inviting',
  setVoiceProfile: (profile) => set({ voiceProfile: profile }),

  isWizardOpen: false,
  setWizardOpen: (isOpen) => set({ isWizardOpen: isOpen }),

  isExporting: false,
  setExporting: (isExporting) => set({ isExporting }),
}));
