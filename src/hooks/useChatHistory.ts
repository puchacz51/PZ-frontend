import { useInfiniteQuery } from '@tanstack/react-query';
import { chatApi, ChatHistoryResponse } from '@/services/chatApi';
import { ChatMessage } from '@/types/chat';

interface UseChatHistoryProps {
  projectId?: number;
  pageSize?: number;
  enabled?: boolean;
}

export const useChatHistory = ({ 
  projectId, 
  pageSize = 20, 
  enabled = true 
}: UseChatHistoryProps = {}) => {
  
  const queryKey = projectId ? ['chat-history', 'project', projectId] : ['chat-history', 'global'];
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      if (projectId) {
        return chatApi.getProjectMessages({
          projectId,
          page: pageParam,
          size: pageSize
        });
      } else {
        return chatApi.getGlobalMessages({
          page: pageParam,
          size: pageSize
        });
      }
    },
    getNextPageParam: (lastPage: ChatHistoryResponse) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });

  // Flatten all messages from all pages
  const messages: ChatMessage[] = data?.pages.flatMap(page => page.content) || [];
  
  // Reverse messages to show oldest first (since API returns newest first by default)
  const orderedMessages = [...messages].reverse();

  return {
    messages: orderedMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    totalMessages: data?.pages[0]?.totalElements || 0,
  };
};
