import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChatMessage } from '@/types/chat';
import { isOnChatPage, formatChatNotification } from '@/lib/utils';
import { useChatHistory } from './useChatHistory';

interface UseChatMessagesProps {
  userId?: number;
  projectId?: number;
}

export const useChatMessages = ({ userId, projectId }: UseChatMessagesProps = {}) => {
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const {
    messages: historyMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingHistory,
    refetch: refetchHistory
  } = useChatHistory({ 
    projectId, 
    enabled: true 
  });

  // Combine history messages with realtime messages
  const allMessages = [...historyMessages, ...realtimeMessages];

  const addMessage = useCallback((message: ChatMessage) => {
    // Check if message already exists in history to avoid duplicates
    const messageExists = historyMessages.some(msg => msg.id === message.id) || 
                         realtimeMessages.some(msg => msg.id === message.id);
    
    if (!messageExists) {
      setRealtimeMessages(prev => [...prev, message]);
      
      if (message.sender.id !== userId && !isOnChatPage()) {
        setUnreadMessages(prev => prev + 1);
        
        const notification = formatChatNotification(
          message.sender.firstName, 
          message.sender.lastName, 
          message.content
        );
        
        toast.info(
          <div>
            <p className="font-bold">{notification.title}</p>
            <p className="text-sm truncate">{notification.message}</p>
          </div>
        );
      }
    }
  }, [userId, historyMessages, realtimeMessages]);

  const clearMessages = useCallback(() => {
    setRealtimeMessages([]);
    refetchHistory();
  }, [refetchHistory]);

  const markAllAsRead = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  // Clear realtime messages when projectId changes
  useEffect(() => {
    setRealtimeMessages([]);
  }, [projectId]);

  return {
    messages: allMessages,
    unreadMessages,
    addMessage,
    clearMessages,
    markAllAsRead,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingHistory,
    refetchHistory
  };
};
