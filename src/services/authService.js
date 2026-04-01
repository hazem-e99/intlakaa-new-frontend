import api, { setAuthToken, setUser, clearAuth, getUser } from '@/lib/api';

// Login
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'خطأ في تسجيل الدخول'
    };
  }
};

// Logout
export const logout = () => {
  clearAuth();
  window.location.href = '/admin/login';
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    
    if (response.data.success) {
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    }
    
    return { success: false };
  } catch (error) {
    clearAuth();
    return { success: false };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    return {
      success: response.data.success,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'خطأ في تغيير كلمة المرور'
    };
  }
};

// Accept invite
export const acceptInvite = async (token, password) => {
  try {
    const response = await api.post('/auth/accept-invite', {
      token,
      password
    });
    
    if (response.data.success) {
      const { token: authToken, user } = response.data;
      setAuthToken(authToken);
      setUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'خطأ في قبول الدعوة'
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getUser();
  return !!(token && user);
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Check if user is owner
export const isOwner = () => {
  return getUserRole() === 'owner';
};

// Check if user must change password
export const mustChangePassword = () => {
  const user = getUser();
  return user?.mustChangePassword || false;
};
