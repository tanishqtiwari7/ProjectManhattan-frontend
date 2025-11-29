import { create } from 'zustand';

export const useStudentStore = create((set) => ({
  studentProfile: null,
  
  setStudentProfile: (profile) => set({ studentProfile: profile }),
  
  fetchStudentProfile: async (studentId) => {
    // Placeholder for API call
    console.log('Fetching profile for:', studentId);
    // Mock data
    set({ 
      studentProfile: {
        id: studentId,
        fullName: 'Test Student',
        enrollmentNo: '0101CS211001',
        branch: 'CSE',
        currentCGPA: 8.5
      } 
    });
  },
}));
