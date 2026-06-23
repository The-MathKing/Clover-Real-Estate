import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';

export const WizardModal: React.FC = () => {
  const { 
    isWizardOpen, 
    setWizardOpen, 
    propertyDetails, 
    setPropertyDetails, 
    images, 
    setImages, 
    addImage 
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [featureInput, setFeatureInput] = useState('');

  if (!isWizardOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyDetails({ [name]: value });
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setPropertyDetails({
        features: [...(propertyDetails.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setPropertyDetails({
      features: propertyDetails.features.filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach((file) => {
        const url = URL.createObjectURL(file);
        addImage({
          id: `img-${Date.now()}-${Math.random()}`,
          url,
          file
        });
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setImages(items);
  };

  const handleComplete = () => {
    const newProperty = {
      id: `prop-${Date.now()}`,
      address: propertyDetails.address || 'New Presentation',
      price: propertyDetails.price || '',
      beds: propertyDetails.beds || '',
      baths: propertyDetails.baths || '',
      sqft: propertyDetails.sqft || '',
      coverImage: images.length > 0 ? images[0].url : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      status: 'Ready' as const,
      description: propertyDetails.description || '',
      features: propertyDetails.features || [],
      images: images.map(img => ({ id: img.id, url: img.url }))
    };

    useStore.getState().addPropertyToList(newProperty);
    useStore.getState().setActiveTab('my-videos');

    setWizardOpen(false);
    setStep(1);
    
    // Reset wizard fields
    setPropertyDetails({
      address: '', price: '', beds: '', baths: '', sqft: '', description: '', features: []
    });
    setImages([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">Create New Presentation</h2>
            <p className="text-xs text-neutral-400">Step {step} of 2</p>
          </div>
          <button 
            onClick={() => setWizardOpen(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-emerald-400">Property Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Property Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={propertyDetails.address}
                    onChange={handleInputChange}
                    placeholder="124 Bellevue Ave, Newport, RI"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Asking Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={propertyDetails.price}
                    onChange={handleInputChange}
                    placeholder="$2,450,000"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="text"
                    name="beds"
                    value={propertyDetails.beds}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="text"
                    name="baths"
                    value={propertyDetails.baths}
                    onChange={handleInputChange}
                    placeholder="4.5"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Square Footage
                  </label>
                  <input
                    type="text"
                    name="sqft"
                    value={propertyDetails.sqft}
                    onChange={handleInputChange}
                    placeholder="4,800"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={propertyDetails.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the property highlights, location, and ambiance..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Key Features & Highlights
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                    placeholder="Chef's Kitchen, Heated Pool, Ocean Views..."
                    className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-3 bg-neutral-800 hover:bg-neutral-750 text-white rounded-lg transition-colors border border-neutral-700/50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {propertyDetails.features?.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-850 text-sm border border-neutral-800 text-neutral-300"
                    >
                      {feature}
                      <button 
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-neutral-500 hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-emerald-400">Media Timeline</h3>
              
              {/* Dropzone */}
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-800 hover:border-emerald-500/50 rounded-xl cursor-pointer bg-neutral-950/50 hover:bg-neutral-950/80 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-neutral-500 mb-3" />
                  <p className="text-sm text-neutral-300 font-medium">Click or Drag & Drop to upload images</p>
                  <p className="text-xs text-neutral-500 mt-1">Supports PNG, JPG, WEBP</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Draggable Image Timeline */}
              {images.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm font-semibold text-neutral-300 mb-4">Arrange Timeline Sequence</p>
                  
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="images-timeline" direction="vertical">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef} 
                          className="space-y-3"
                        >
                          {images.map((image, index) => (
                            <Draggable key={image.id} draggableId={image.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-4 p-3 bg-neutral-950 border border-neutral-850 rounded-xl group"
                                >
                                  <div {...provided.dragHandleProps} className="text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="flex-1 text-sm text-neutral-350 font-medium">
                                    Slide {index + 1}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveImage(image.id)}
                                    className="p-1.5 hover:bg-neutral-800 text-neutral-500 hover:text-rose-400 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-5 border-t border-neutral-800 bg-neutral-950/40">
          <button
            onClick={() => setStep(1)}
            disabled={step === 1}
            className="px-6 py-2.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-0 transition-all font-medium text-sm"
          >
            Back
          </button>
          
          <div className="flex gap-3">
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!propertyDetails.address}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={images.length === 0}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all"
              >
                <Check className="w-4 h-4" />
                Finish Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
