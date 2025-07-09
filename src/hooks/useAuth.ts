
import { useTypedSelector } from './useTypedSelector';
import { useDispatch } from 'react-redux';
import { logout as logoutAction, loginSuccess, loginStart, loginFailure, clearError as clearErrorAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useTypedSelector(state => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // Mock login - in production, this would call your API
      const mockUser = {
        id: '1',
        name: 'Viraat Shrivastava',
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viraat',
        createdAt: '2024-01-15T10:30:00Z',
        joinedDate: '2024-01-15T10:30:00Z',
      };
      
      const mockToken = 'mock-jwt-token';
      
      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      return { success: true };
    } catch (err) {
      dispatch(loginFailure('Login failed. Please try again.'));
      return { success: false };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // Mock registration - in production, this would call your API
      const mockUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        createdAt: new Date().toISOString(),
        joinedDate: new Date().toISOString(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      return { success: true };
    } catch (err) {
      dispatch(loginFailure('Registration failed. Please try again.'));
      return { success: false };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
