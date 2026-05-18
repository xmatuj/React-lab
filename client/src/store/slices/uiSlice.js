import { createSlice } from '@reduxjs/toolkit';

const loadThemeFromStorage = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' ? 'dark' : 'light';
};

const initialState = {
  theme: loadThemeFromStorage(),
  notifications: [],
};

let timeoutsMap = new Map();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (typeof document !== 'undefined') document.body.className = state.theme;
    },
    addNotification: (state, action) => {
      const { message, type = 'info', duration = 5000 } = action.payload;
      const id = Date.now() + Math.random();
      state.notifications.push({ id, message, type, duration });
      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          if (typeof window !== 'undefined') {
            const store = require('../index').default;
            if (store) store.dispatch(removeNotification(id));
          }
          timeoutsMap.delete(id);
        }, duration);
        timeoutsMap.set(id, timeoutId);
      }
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      if (timeoutsMap.has(id)) {
        clearTimeout(timeoutsMap.get(id));
        timeoutsMap.delete(id);
      }
      state.notifications = state.notifications.filter(n => n.id !== id);
    },
    clearNotifications: (state) => {
      timeoutsMap.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsMap.clear();
      state.notifications = [];
    },
  },
});

export const { toggleTheme, addNotification, removeNotification, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;