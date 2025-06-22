import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { ChatMessage } from "@/types/chat";
import { useUser } from "./UserContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WEBSOCKET_CONFIG } from "@/config/websocket";
import { useChatMessages } from "@/hooks/useChatMessages";
interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, projectId?: number) => void;
  isConnected: boolean;
  error: string | null;
  unreadMessages: number;
  markAllAsRead: () => void;
  reconnectFailed: boolean;
  reconnectToChat: () => void;
  joinProject: (projectId: number) => void;
  leaveProject: () => void;
  currentProjectId: number | null;
  fetchNextPage?: () => Promise<any>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoadingHistory?: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const { user } = useUser();
  
  const {
    messages,
    unreadMessages,
    addMessage,
    clearMessages,
    markAllAsRead,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingHistory
  } = useChatMessages({ userId: user?.id, projectId: currentProjectId });

  const handleConnect = useCallback(() => {
    if (!user || !webSocket.client) return;

    // Subscribe to public chat
    webSocket.subscribe(WEBSOCKET_CONFIG.topics.public, (message) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      addMessage(chatMessage);
    });

    // Announce user joining
    webSocket.publish(
      WEBSOCKET_CONFIG.endpoints.addUser,
      JSON.stringify({
        content: `${user.firstName} ${user.lastName} dołączył do czatu`,
        senderEmail: user.email,
        type: 'JOIN'
      })
    );
  }, [user, addMessage]);

  const webSocket = useWebSocket({
    onConnect: handleConnect,
    onDisconnect: () => {},
    onError: () => {}
  });

  const joinProject = useCallback((projectId: number) => {
    if (!webSocket.client?.connected || !user) return;
    
    setCurrentProjectId(projectId);
    clearMessages();
    
    webSocket.subscribe(WEBSOCKET_CONFIG.topics.project(projectId), (message) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      addMessage(chatMessage);
    });
  }, [webSocket.client, user, clearMessages, addMessage]);

  const leaveProject = useCallback(() => {
    setCurrentProjectId(null);
    clearMessages();
  }, [clearMessages]);

  const sendMessage = useCallback((content: string, projectId?: number) => {
    if (!webSocket.client?.connected || !user) return;

    const messagePayload = {
      content,
      senderEmail: user.email,
      projectId: projectId || currentProjectId,
      type: 'CHAT'
    };

    webSocket.publish(WEBSOCKET_CONFIG.endpoints.sendMessage, JSON.stringify(messagePayload));
  }, [webSocket.client, user, currentProjectId]);

  useEffect(() => {
    if (user) {
      webSocket.connect();
    }
    
    return () => {
      webSocket.disconnect();
    };
  }, [user]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isConnected: webSocket.isConnected, 
      error: webSocket.error, 
      unreadMessages,
      markAllAsRead,
      reconnectFailed: webSocket.reconnectFailed,
      reconnectToChat: webSocket.reconnect,
      joinProject,
      leaveProject,
      currentProjectId,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoadingHistory
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
