import axiosInstance from '@/config/axios';
import { ChatMessage } from '@/types/chat';

export interface ChatMessagesResponse {
  content: ChatMessage[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
}

export const chatService = {
  // Pobieranie wiadomości z paginacją zgodnie z dokumentacją
  async getMessages(page: number = 0, size: number = 20): Promise<ChatMessagesResponse> {
    const response = await axiosInstance.get<ChatMessagesResponse>(
      `/chat/messages?page=${page}&size=${size}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return response.data;
  },

  // Wysyłanie wiadomości przez REST API (fallback) - zgodnie z dokumentacją
  async sendMessage(content: string): Promise<SendMessageResponse> {
    const response = await axiosInstance.post<SendMessageResponse>('/chat/send', {
      content
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};
