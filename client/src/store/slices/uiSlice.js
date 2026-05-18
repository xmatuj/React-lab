import { createSlice } from '@reduxjs/toolkit';

const loadThemeFromStorage = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' ? 'dark' : 'light';
};

const loadFontSizeFromStorage = () => {
  const savedSize = localStorage.getItem('fontSize');
  return savedSize || '100';
};

const initialState = {
  theme: loadThemeFromStorage(),
  notifications: [],
  fontSize: loadFontSizeFromStorage(),
};

let timeoutsMap = new Map();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (typeof document !== 'undefined') {
        document.body.className = state.theme;
        document.documentElement.style.setProperty('--font-size-base', `${state.fontSize}%`);
      }
    },
    setFontSize: (state, action) => {
      let newSize = action.payload;
      if (newSize < 70) newSize = 70;
      if (newSize > 200) newSize = 200;
      state.fontSize = newSize;
      localStorage.setItem('fontSize', newSize);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-size-base', `${newSize}%`);
      }
    },
    increaseFontSize: (state) => {
      let newSize = parseInt(state.fontSize) + 10;
      if (newSize > 200) newSize = 200;
      state.fontSize = newSize;
      localStorage.setItem('fontSize', newSize);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-size-base', `${newSize}%`);
      }
    },
    decreaseFontSize: (state) => {
      let newSize = parseInt(state.fontSize) - 10;
      if (newSize < 70) newSize = 70;
      state.fontSize = newSize;
      localStorage.setItem('fontSize', newSize);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-size-base', `${newSize}%`);
      }
    },
    resetFontSize: (state) => {
      state.fontSize = 100;
      localStorage.setItem('fontSize', 100);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-size-base', '100%');
      }
    },
    addNotification: (state, action) => {
      const { message, type = 'info', duration = 5000 } = action.payload;
      const id = Date.now() + Math.random();
      state.notifications.push({ id, message, type, duration });
      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          const store = require('../index').default;
          if (store) store.dispatch(removeNotification(id));
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

export const { 
  toggleTheme, 
  addNotification, 
  removeNotification, 
  clearNotifications,
  setFontSize,
  increaseFontSize,
  decreaseFontSize,
  resetFontSize
} = uiSlice.actions;

export default uiSlice.reducer;