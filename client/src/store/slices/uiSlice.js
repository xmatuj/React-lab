import { createSagaSlice } from '../createSagaSlice';

const initialState = {
  theme: 'light',
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
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  asyncReducers: {
    fetchNotifications: {
      handler: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { id: 1, message: 'Добро пожаловать в MusicShop!', type: 'info' },
          { id: 2, message: 'Новые поступления гитар', type: 'success' },
        ];
      },
      onSuccess: (state, action) => {
        state.notifications = action.payload;
        state.error = null;
      },
      loadingKey: 'loading',
      errorKey: 'error',
    },
  },
});

export const { 
  toggleTheme, 
  toggleSidebar, 
  addNotification, 
  removeNotification, 
  clearNotifications,
  fetchNotifications 
} = actions;
export const uiSaga = saga;
export default reducer;