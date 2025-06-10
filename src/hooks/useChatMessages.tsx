import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ChatMessage } from '@/types/chat';
import { isOnChatPage, formatChatNotification } from '@/lib/utils';

interface UseChatMessagesProps {
  userId?: number;
}

export const useChatMessages = ({ userId }: UseChatMessagesProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    
    if (message.sender.id !== userId && !isOnChatPage()) {
      setUnreadMessages(prev => prev + 1);
      
      const notification = formatChatNotification(
        message.sender.firstName, 
        message.sender.lastName, 
        message.content
      );
      
      toast.info(
        () => (
          <div>
            <p className="font-bold">{notification.title}</p>
            <p className="text-sm truncate">{notification.message}</p>
          </div>
        )
      );
    }
  }, [userId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  const setMessagesHistory = useCallback((history: ChatMessage[]) => {
    setMessages(history);
  }, []);

  return {
    messages,
    unreadMessages,
    addMessage,
    clearMessages,
    markAllAsRead,
    setMessagesHistory
  };
};
