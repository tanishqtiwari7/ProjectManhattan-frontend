import { create } from 'zustand';

export const useMockInterviewStore = create((set) => ({
  results: [],
  
  setResults: (results) => set({ results }),
  
  fetchResults: async () => {
    // Placeholder for API call
    console.log('Fetching mock interview results');
    // Mock data
    set({ 
      results: [
        { 
          attemptId: 1, 
          attemptNumber: 1, 
          selected: false, 
          rejectedAt: 'Technical',
          rounds: { gd: true, hr: true, technical: false }
        }
      ] 
    });
  },
}));
