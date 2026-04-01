import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'admin';
  createdAt: string;
  lastSignInAt?: string;
  isActive: boolean;
  mustChangePassword: boolean;
}

/**
 * Get all users (Owner only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');

    if (response.data.success) {
      return response.data.users;
    }

    throw new Error(response.data.message);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'خطأ في جلب المستخدمين');
  }
};

/**
 * Invite new admin (Owner only)
 */
export const inviteUser = async (email: string): Promise<void> => {
  try {
    const response = await api.post('/users/invite', { email });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error('Error inviting user:', error);
    throw new Error(error.response?.data?.message || 'خطأ في إرسال الدعوة');
  }
};

/**
 * Update user role (Owner only)
 */
export const updateUserRole = async (userId: string, role: 'owner' | 'admin'): Promise<void> => {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw new Error(error.response?.data?.message || 'خطأ في تحديث الدور');
  }
};

/**
 * Delete user (Owner only)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await api.delete(`/users/${userId}`);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'خطأ في حذف المستخدم');
  }
};
