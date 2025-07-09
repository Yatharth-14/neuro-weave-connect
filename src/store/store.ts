
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import threadsSlice from './slices/threadsSlice';
import searchSlice from './slices/searchSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    threads: threadsSlice,
    search: searchSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
