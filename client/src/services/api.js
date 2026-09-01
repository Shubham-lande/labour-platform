import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock fallback generator for static deployments (e.g. Vercel client-only demo)
const getMockResponse = (url, method, data) => {
  const normalizedUrl = url || '';

  if (normalizedUrl.includes('/auth/login')) {
    const identifier = (data?.identifier || '').toLowerCase();
    let role = 'customer';
    let name = 'Demo Contractor / Customer';
    if (identifier.startsWith('admin') || identifier === 'admin@labourhub.com') {
      role = 'admin';
      name = 'System Administrator';
    } else if (identifier.startsWith('labour') || identifier === 'labour@labourhub.com' || identifier.includes('worker')) {
      role = 'labour';
      name = 'Demo Skilled Worker';
    } else if (identifier.startsWith('contractor') || identifier.startsWith('customer') || identifier === 'customer@labourhub.com') {
      role = 'customer';
      name = 'Demo Contractor / Customer';
    }

    const mockUser = {
      _id: 'mock_user_' + role,
      id: 'mock_user_' + role,
      name,
      email: identifier || `${role}@labourhub.com`,
      role,
      phone: '+91 98765 43210',
      isVerified: true,
    };

    return {
      success: true,
      token: 'demo_jwt_token_' + Date.now(),
      user: mockUser,
      profile: { ...mockUser, bio: 'Live demo user profile', status: 'available' },
    };
  }

  if (normalizedUrl.includes('/auth/me')) {
    const storedUserStr = localStorage.getItem('labour_platform_user');
    let storedUser = null;
    try { storedUser = JSON.parse(storedUserStr); } catch (e) {}
    
    const role = storedUser?.role || 'customer';
    const mockUser = storedUser && storedUser.role ? storedUser : {
      _id: 'mock_user_customer',
      name: 'Demo Customer',
      email: 'customer@labourhub.com',
      role: 'customer',
    };

    return {
      success: true,
      user: mockUser,
      profile: { ...mockUser, role, status: 'available' },
    };
  }

  if (normalizedUrl.includes('/auth/register')) {
    const mockUser = {
      _id: 'mock_user_' + Date.now(),
      name: data?.name || 'Registered User',
      email: data?.email || 'user@labourhub.com',
      role: data?.role || 'customer',
    };
    return {
      success: true,
      token: 'demo_jwt_token_' + Date.now(),
      user: mockUser,
      profile: mockUser,
    };
  }

  if (normalizedUrl.includes('/customer/dashboard')) {
    return {
      success: true,
      stats: { totalBookings: 12, activeProjects: 3, totalSpent: 45000, pendingInvoices: 2 },
    };
  }

  if (normalizedUrl.includes('/labour/dashboard')) {
    return {
      success: true,
      stats: { totalJobs: 28, completedJobs: 25, totalEarnings: 68000, rating: 4.9 },
    };
  }

  if (normalizedUrl.includes('/admin/dashboard')) {
    return {
      success: true,
      stats: { totalUsers: 1420, activeBookings: 85, verifiedLabour: 640, monthlyRevenue: 320000 },
    };
  }

  if (normalizedUrl.includes('/labour/profiles')) {
    return {
      success: true,
      data: [
        { _id: '1', name: 'Rajesh Kumar', category: 'Electrician', rating: 4.9, hourlyRate: 350, experience: '6 yrs', availabilityStatus: 'available', city: 'Mumbai' },
        { _id: '2', name: 'Amit Sharma', category: 'Plumber', rating: 4.8, hourlyRate: 300, experience: '8 yrs', availabilityStatus: 'available', city: 'Delhi' },
        { _id: '3', name: 'Suresh Verma', category: 'Carpenter', rating: 4.7, hourlyRate: 400, experience: '5 yrs', availabilityStatus: 'available', city: 'Bangalore' },
      ],
    };
  }

  return { success: true, message: 'Action completed successfully (Demo Mode)', data: [] };
};

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('labour_platform_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Handling + Demo Fallback
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const is404OrNetwork = !error.response || error.response.status === 404 || error.response.status === 405 || error.code === 'ERR_NETWORK';
    if (is404OrNetwork) {
      const url = error.config?.url || '';
      const method = error.config?.method || 'get';
      let postData = {};
      try {
        postData = JSON.parse(error.config?.data || '{}');
      } catch (e) {}

      console.info(`[Demo Fallback]: Handling ${method.toUpperCase()} ${url}`);
      return Promise.resolve(getMockResponse(url, method, postData));
    }

    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Clearing local session token.');
      localStorage.removeItem('labour_platform_token');
      localStorage.removeItem('labour_platform_user');
    }
    const message = error.response?.data?.message || error.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

export default api;
