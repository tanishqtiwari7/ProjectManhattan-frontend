import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  
  setNotifications: (notifications) => set({ notifications }),
  
  fetchNotifications: async () => {
    // Placeholder for API call
    // Mock data
    const mockNotifications = [
      { id: 1, type: 'new_caf', studentId: 101, studentName: 'John Doe', timestamp: '2023-10-26T10:00:00Z', details: { enrollmentNo: '0101CS211001' } },
      { id: 2, type: 'edit_request', studentId: 102, studentName: 'Jane Smith', timestamp: '2023-10-26T11:30:00Z', details: { field: 'internship' } },
    ];
    set({ notifications: mockNotifications });
  },
  
  approveRequest: async (id, type) => {
    console.log(`Approving ${type} request ${id}`);
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  rejectRequest: async (id, type) => {
    console.log(`Rejecting ${type} request ${id}`);
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
}));
