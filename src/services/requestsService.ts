import api from '@/lib/api';

export interface Request {
  _id: string;
  name: string;
  phone: string;
  storeUrl: string;
  monthlySales: string;
  ipAddress: string | null;
  country: string | null;
  phoneCountry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  data: Request[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetch requests with pagination and search
 */
export const getRequests = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PaginatedResponse> => {
  try {
    const response = await api.get('/requests', {
      params: { page, limit, search }
    });

    if (response.data.success) {
      return {
        data: response.data.data,
        count: response.data.count,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      };
    }

    throw new Error(response.data.message);
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    throw new Error(error.response?.data?.message || 'خطأ في جلب الطلبات');
  }
};

/**
 * Search requests by name or phone
 */
export const searchRequests = async (query: string): Promise<Request[]> => {
  try {
    const response = await getRequests(1, 1000, query);
    return response.data;
  } catch (error) {
    console.error('Error searching requests:', error);
    throw error;
  }
};

/**
 * Fetch paginated requests (alias for getRequests)
 */
export const paginateRequests = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse> => {
  return getRequests(page, limit);
};

/**
 * Search and paginate requests
 */
export const searchAndPaginateRequests = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse> => {
  return getRequests(page, limit, query);
};

/**
 * Delete a request by ID
 */
export const deleteRequest = async (id: string | number): Promise<void> => {
  try {
    const response = await api.delete(`/requests/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error('Error deleting request:', error);
    throw new Error(error.response?.data?.message || 'خطأ في حذف الطلب');
  }
};

/**
 * Create a new request (public endpoint)
 */
export const createRequest = async (requestData: {
  name: string;
  phone: string;
  storeUrl: string;
  monthlySales: string;
  ipAddress?: string;
  country?: string;
  phoneCountry?: string;
}): Promise<Request> => {
  try {
    const response = await api.post('/requests', requestData);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error: any) {
    console.error('Error creating request:', error);
    throw new Error(error.response?.data?.message || 'خطأ في إنشاء الطلب');
  }
};

/**
 * Export all requests
 */
export const exportRequests = async (): Promise<Request[]> => {
  try {
    const response = await api.get('/requests/export');

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error: any) {
    console.error('Error exporting requests:', error);
    throw new Error(error.response?.data?.message || 'خطأ في تصدير الطلبات');
  }
};
