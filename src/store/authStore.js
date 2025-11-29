import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  role: null, // 'student' or 'admin'
  token: null,

  login: (userData, token) => set({ 
    user: userData, 
    isAuthenticated: true, 
    role: userData.role,
    token: token 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    role: null,
    token: null 
  }),

  // For testing/development
  setRole: (role) => set({ role}),
}));
