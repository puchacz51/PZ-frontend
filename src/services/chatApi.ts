import { ChatMessage } from '@/types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ChatHistoryParams {
  projectId?: number;
  page?: number;
  size?: number;
  since?: string;
}

export interface ChatHistoryResponse {
  content: ChatMessage[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const chatApi = {
  // Get global chat messages with pagination
  getGlobalMessages: async (params: { page?: number; size?: number }): Promise<ChatHistoryResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    
    const response = await fetch(`${API_BASE_URL}/chat/global?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch global chat messages: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get project chat messages with pagination
  getProjectMessages: async (params: { projectId: number; page?: number; size?: number }): Promise<ChatHistoryResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    
    const response = await fetch(`${API_BASE_URL}/chat/project/${params.projectId}?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project chat messages: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get recent project messages since timestamp
  getRecentProjectMessages: async (params: { projectId: number; since: string }): Promise<ChatMessage[]> => {
    const searchParams = new URLSearchParams();
    searchParams.append('since', params.since);
    
    const response = await fetch(`${API_BASE_URL}/chat/project/${params.projectId}/recent?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recent project messages: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
};
