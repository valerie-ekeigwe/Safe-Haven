// API client for Safe Haven backend
const API_URL = 'http://localhost:3001/api';

// Get auth token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Save auth token
const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove auth token
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// ==================== AUTH ====================

export const auth = {
  // Register new user
  register: async (email, password, name, neighborhood = 'Downtown') => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, neighborhood }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    saveToken(data.token);
    return data;
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    saveToken(data.token);
    return data;
  },

  // Logout
  logout: () => {
    removeToken();
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!getToken();
  },
};

// ==================== POSTS ====================

export const posts = {
  // Get all posts (optional category filter)
  getAll: async (category = null) => {
    const url = category && category !== 'all' 
      ? `${API_URL}/posts?category=${category}` 
      : `${API_URL}/posts`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch posts');
    }

    return data;
  },

  // Get single post
  getById: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch post');
    }

    return data;
  },

  // Create new post
  create: async (postData) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create post');
    }

    return data;
  },

  // Mark post as helpful
  markHelpful: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}/helpful`, {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to mark as helpful');
    }

    return data;
  },
};

// ==================== COMMENTS ====================

export const comments = {
  // Get comments for a post
  getForPost: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch comments');
    }

    return data;
  },

  // Add comment to post
  create: async (postId, commentData) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(commentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add comment');
    }

    return data;
  },
};

// Export all
export default {
  auth,
  posts,
  comments,
};
