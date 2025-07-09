
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './useTypedSelector';
import { loginStart, loginSuccess, loginFailure, logout, clearError } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import { mockUser } from '../services/mockData';
import { socketService } from '../services/socket';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useTypedSelector(state => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // Mock login for demo
      if (email === 'demo@neuroshare.com' && password === 'demo123') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        socketService.connect(mockToken);
        return { success: true };
      }
      
      throw new Error('Invalid credentials');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // Mock registration for demo
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        joinedDate: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      dispatch(loginSuccess({ user: newUser, token: mockToken }));
      socketService.connect(mockToken);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    socketService.disconnect();
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
