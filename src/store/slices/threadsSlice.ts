
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Thread {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  contributors: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  isCollaborating?: boolean;
  views: number;
  likes: number;
}

interface ThreadsState {
  threads: Thread[];
  currentThread: Thread | null;
  trendingThreads: Thread[];
  userThreads: Thread[];
  loading: boolean;
  error: string | null;
}

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
  trendingThreads: [],
  userThreads: [],
  loading: false,
  error: null,
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    setCurrentThread: (state, action: PayloadAction<Thread>) => {
      state.currentThread = action.payload;
    },
    setTrendingThreads: (state, action: PayloadAction<Thread[]>) => {
      state.trendingThreads = action.payload;
    },
    setUserThreads: (state, action: PayloadAction<Thread[]>) => {
      state.userThreads = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload);
      state.userThreads.unshift(action.payload);
    },
    updateThread: (state, action: PayloadAction<Thread>) => {
      const index = state.threads.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.threads[index] = action.payload;
      }
      if (state.currentThread?.id === action.payload.id) {
        state.currentThread = action.payload;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  setThreads, 
  setCurrentThread, 
  setTrendingThreads, 
  setUserThreads,
  addThread, 
  updateThread, 
  setError, 
  clearError 
} = threadsSlice.actions;
export default threadsSlice.reducer;
