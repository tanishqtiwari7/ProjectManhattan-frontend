import { create } from 'zustand';

export const useCafStore = create((set) => ({
  cafData: null,
  cafStatus: 'not_submitted', // not_submitted, pending, approved, rejected
  isEditMode: false,
  editableFields: ['current_cgpa', 'domain_interest_primary', 'domain_interest_secondary', 'resume_file_url'],
  
  setCafData: (data) => set({ cafData: data }),
  setCafStatus: (status) => set({ cafStatus: status }),
  setEditMode: (mode) => set({ isEditMode: mode }),
  
  // Actions
  submitCaf: async (formData) => {
    // Placeholder for API call
    console.log('Submitting CAF:', formData);
    set({ cafStatus: 'pending', cafData: formData });
  },
  
  updateCaf: async (updates) => {
    // Placeholder for API call
    console.log('Updating CAF:', updates);
    set((state) => ({ cafData: { ...state.cafData, ...updates } }));
  },
}));
