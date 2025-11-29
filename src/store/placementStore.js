import { create } from 'zustand';

export const usePlacementStore = create((set) => ({
  eligibleCompanies: [],
  
  setEligibleCompanies: (companies) => set({ eligibleCompanies: companies }),
  
  fetchEligibleCompanies: async () => {
    // Placeholder for API call
    console.log('Fetching eligible companies');
    // Mock data
    set({ 
      eligibleCompanies: [
        { 
          companyId: 1, 
          companyName: 'TCS', 
          location: 'Pune', 
          jobDescription: 'Software Engineer', 
          eligibilityCriteria: { minCGPA: 7.0, allowedBranches: ['CSE', 'IT'], maxBacklogs: 0 } 
        }
      ] 
    });
  },
}));
