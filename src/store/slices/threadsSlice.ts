
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
  id: string;
  threadId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
}

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
  likedBy: string[];
  comments: Comment[];
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
    toggleThreadLike: (state, action: PayloadAction<{ threadId: string; userId: string }>) => {
      const { threadId, userId } = action.payload;
      
      const updateThreadLike = (thread: Thread) => {
        if (thread.id === threadId) {
          if (thread.likedBy.includes(userId)) {
            thread.likedBy = thread.likedBy.filter(id => id !== userId);
            thread.likes = Math.max(0, thread.likes - 1);
          } else {
            thread.likedBy.push(userId);
            thread.likes += 1;
          }
        }
      };

      // Update in all arrays
      state.threads.forEach(updateThreadLike);
      state.trendingThreads.forEach(updateThreadLike);
      state.userThreads.forEach(updateThreadLike);
      
      if (state.currentThread?.id === threadId) {
        updateThreadLike(state.currentThread);
      }
    },
    addComment: (state, action: PayloadAction<{ threadId: string; comment: Comment }>) => {
      const { threadId, comment } = action.payload;
      
      const addCommentToThread = (thread: Thread) => {
        if (thread.id === threadId) {
          thread.comments.unshift(comment);
        }
      };

      state.threads.forEach(addCommentToThread);
      state.trendingThreads.forEach(addCommentToThread);
      state.userThreads.forEach(addCommentToThread);
      
      if (state.currentThread?.id === threadId) {
        addCommentToThread(state.currentThread);
      }
    },
    toggleCommentLike: (state, action: PayloadAction<{ threadId: string; commentId: string; userId: string }>) => {
      const { threadId, commentId, userId } = action.payload;
      
      const updateCommentLike = (thread: Thread) => {
        if (thread.id === threadId) {
          const comment = thread.comments.find(c => c.id === commentId);
          if (comment) {
            if (comment.likedBy.includes(userId)) {
              comment.likedBy = comment.likedBy.filter(id => id !== userId);
              comment.likes = Math.max(0, comment.likes - 1);
            } else {
              comment.likedBy.push(userId);
              comment.likes += 1;
            }
          }
        }
      };

      state.threads.forEach(updateCommentLike);
      state.trendingThreads.forEach(updateCommentLike);
      state.userThreads.forEach(updateCommentLike);
      
      if (state.currentThread?.id === threadId) {
        updateCommentLike(state.currentThread);
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
  toggleThreadLike,
  addComment,
  toggleCommentLike,
  setError, 
  clearError 
} = threadsSlice.actions;
export default threadsSlice.reducer;
export type { Thread, Comment };
