// API client for Spark server
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface User {
  id: number;
  email: string;
  username: string;
  fullname: string;
  bio?: string;
  avatar?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  media_urls: string[];
  created_at: string;
  user: {
    username: string;
    fullname: string;
    avatar: string;
  };
  likeCount: number;
  commentCount: number;
  engagementCount: number;
  userLiked: boolean;
  mindReadingHook: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    username: string;
    fullname: string;
  };
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// API functions
export const api = {
  // Auth endpoints
  register: async (data: { email: string; password: string; username: string; fullname: string }) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Posts endpoints
  getFeed: async (token?: string): Promise<{ posts: Post[] }> => {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts/feed`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feed');
    }

    return response.json();
  },

  createPost: async (data: {
    title: string;
    content: string;
    category: string;
    media_urls?: string[];
  }, token: string) => {
    const response = await fetch(`${API_BASE}/posts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Users endpoints
  searchUsers: async (query: string): Promise<{ users: User[] }> => {
    const response = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search users');
    }
    return response.json();
  },

  getUser: async (id: number): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE}/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    return response.json();
  },

  // Comments endpoints
  getComments: async (postId: number): Promise<{ comments: Comment[] }> => {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to get comments');
    }
    return response.json();
  },

  addComment: async (data: { post_id: number; content: string }, token: string) => {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Likes endpoints
  getLikeStatus: async (postId: number, token: string): Promise<{ isLiked: boolean }> => {
    const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get like status');
    }
    return response.json();
  },

  toggleLike: async (postId: number, token: string): Promise<{ action: 'liked' | 'unliked', likeCount: number }> => {
    const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }
    return response.json();
  },

  // Upload endpoint
  uploadFile: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  // Analytics endpoints
  getUserAnalytics: async (userId: number, token: string): Promise<{ analytics: any }> => {
    const response = await fetch(`${API_BASE}/analytics/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get analytics');
    }
    return response.json();
  },

  getSmmStats: async (token: string): Promise<{ smm_stats: any }> => {
    const response = await fetch(`${API_BASE}/smm/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get SMM stats');
    }
    return response.json();
  },

  // Notifications
  getNotifications: async (token: string): Promise<{ notifications: Notification[] }> => {
    const response = await fetch(`${API_BASE}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get notifications');
    }
    return response.json();
  },

  // Messages
  getConversation: async (userId: number, token: string): Promise<{ messages: any[] }> => {
    const response = await fetch(`${API_BASE}/messages/conversation/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get conversation');
    }
    return response.json();
  },

  sendMessage: async (data: { receiver_id: number; content: string }, token: string) => {
    const response = await fetch(`${API_BASE}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
