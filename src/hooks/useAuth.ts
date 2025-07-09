
import { useTypedSelector } from './useTypedSelector';
import { useDispatch } from 'react-redux';
import { logout as logoutAction, loginSuccess } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useTypedSelector(state => state.auth);

  const login = async (email: string, password: string) => {
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
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
};
