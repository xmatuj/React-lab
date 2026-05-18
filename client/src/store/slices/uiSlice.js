import { createSagaSlice } from '../createSagaSlice';

const loadThemeFromStorage = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme || 'light';
};

const initialState = {
  theme: loadThemeFromStorage(),
  sidebarOpen: true,
  notifications: [],
  loading: false,
  error: null,
};

const { reducer, actions, saga } = createSagaSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (typeof document !== 'undefined') {
        document.body.className = state.theme;
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action) => {
      const { message, type = 'info', duration = 3000 } = action.payload;
      const id = Date.now();
      state.notifications.push({
        id,
        message,
        type,
        timestamp: new Date().toISOString(),
      });
      
      if (duration > 0) {
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('removeNotification', { detail: { id } }));
          }
        }, duration);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGlobalError: (state, action) => {
      state.error = action.payload;
    },
    clearGlobalError: (state) => {
      state.error = null;
    },
  },
  asyncReducers: {},
});

export const { 
  toggleTheme, 
  toggleSidebar, 
  addNotification, 
  removeNotification, 
  clearNotifications,
  setGlobalLoading,
  setGlobalError,
  clearGlobalError,
} = actions;

export const uiSaga = saga;
export default reducer;