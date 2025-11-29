import { create } from 'zustand';

export const useInternshipStore = create((set) => ({
  internships: [],
  
  setInternships: (internships) => set({ internships }),
  
  fetchInternships: async () => {
    // Placeholder for API call
    console.log('Fetching internships');
    // Mock data
    set({ 
      internships: [
        { id: 1, companyName: 'Google', internshipType: 'Summer', duration: '3 months', stipend: 'Paid', hasPPO: true }
      ] 
    });
  },
  
  addInternship: async (internshipData) => {
    console.log('Adding internship:', internshipData);
    set((state) => ({
      internships: [...state.internships, { ...internshipData, id: Date.now() }]
    }));
  },
}));
