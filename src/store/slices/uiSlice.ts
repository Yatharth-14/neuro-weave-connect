
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: string;
  }>;
}

const initialState: UIState = {
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: false,
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  notifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
    },
    addNotification: (state, action: PayloadAction<{message: string; type: 'success' | 'error' | 'info' | 'warning'}>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = [];
      localStorage.setItem('notifications', JSON.stringify([]));
    },
  },
});

export const { 
  toggleDarkMode, 
  toggleSidebar, 
  toggleSidebarCollapse,
  setSidebarCollapsed,
  addNotification, 
  removeNotification, 
  markAllNotificationsAsRead 
} = uiSlice.actions;
export default uiSlice.reducer;
