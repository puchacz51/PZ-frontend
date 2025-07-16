import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { ChatMessage, WebSocketMessage } from "@/types/chat";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";
import ChatService from "@/services/ChatService";
import { chatService } from "@/services/chatRestService";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, projectId?: number) => void;
  isConnected: boolean;
  error: string | null;
  unreadMessages: number;
  markAllAsRead: () => void;
  reconnectFailed: boolean;
  reconnectToChat: () => void;
  loadMoreMessages: () => void;
  hasMoreMessages: boolean;
  isLoadingMessages: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [reconnectFailed, setReconnectFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { user } = useUser();

  // Pobieranie historii wiadomości
  const fetchMessages = useCallback(async (page: number = 0, append: boolean = false) => {
    if (!user) return;
    
    setIsLoadingMessages(true);
    try {
      const response = await chatService.getMessages(page, 20);
      
      if (append) {
        setMessages(prev => [...response.content.reverse(), ...prev]);
      } else {
        setMessages(response.content.reverse());
      }
      
      setHasMoreMessages(!response.last);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Nie udało się pobrać wiadomości');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user]);

  // Inicjalizacja połączenia WebSocket
  const initializeWebSocket = useCallback(() => {
    if (!user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Brak tokena uwierzytelniania');
      return;
    }

    setReconnectFailed(false);
    setError(null);    ChatService.connect(
      token,
      (wsMessage: WebSocketMessage) => {
        console.log('WebSocket message received:', wsMessage.type, wsMessage.content?.substring(0, 20));
        if (wsMessage.type === 'CHAT') {          // Konwertuj WebSocket message na ChatMessage używając pełnych danych z backendu
          const chatMessage: ChatMessage = {
            id: Date.now(), // Tymczasowe ID - możemy użyć timestamp lub backend może dostarczyć ID
            content: wsMessage.content,
            timestamp: wsMessage.timestamp,
            sender: {
              id: wsMessage.senderId || 0,
              firstName: wsMessage.senderFirstName || 'Unknown',
              lastName: wsMessage.senderLastName || '',
              email: wsMessage.senderEmail || 'unknown@example.com',
              avatarUrl: wsMessage.senderAvatarUrl
            }
          };
          
          // Sprawdź czy wiadomość już istnieje (zabezpieczenie przed duplikatami)
          setMessages(prev => {
            const isDuplicate = prev.some(msg => 
              msg.content === chatMessage.content && 
              msg.sender.email === chatMessage.sender.email &&
              Math.abs(new Date(msg.timestamp).getTime() - new Date(chatMessage.timestamp).getTime()) < 5000 // 5 sekund tolerancji
            );
              if (isDuplicate) {
              console.log('Duplicate message detected, skipping:', chatMessage.content.substring(0, 20));
              return prev;
            }
              console.log('Adding new WebSocket message:', {
              content: chatMessage.content.substring(0, 20),
              senderId: chatMessage.sender.id,
              senderEmail: chatMessage.sender.email,
              senderName: `${chatMessage.sender.firstName} ${chatMessage.sender.lastName}`,
              hasAvatar: !!chatMessage.sender.avatarUrl,
              avatarUrl: chatMessage.sender.avatarUrl?.substring(0, 50)
            });
            
            return [...prev, chatMessage];
          });
          
          // Powiadomienie jeśli użytkownik nie jest na stronie czatu
          if (wsMessage.senderEmail !== user.email && !window.location.href.includes("/chat")) {
            setUnreadMessages(prev => prev + 1);
            
            toast.info(
              <div>
                <p className="font-bold">{wsMessage.senderName}</p>
                <p className="text-sm truncate">{wsMessage.content}</p>
              </div>
            );
          }
        } else if (wsMessage.type === 'JOIN') {
          console.log(`${wsMessage.senderName} joined the chat`);
        } else if (wsMessage.type === 'ERROR') {
          console.error('WebSocket error:', wsMessage.content);
          setError(wsMessage.content);
        }
      },      () => {
        setIsConnected(true);
        setError(null);
        setReconnectFailed(false);
        
        console.log('WebSocket connected successfully');
        
        // Powiadom o dołączeniu użytkownika
        ChatService.addUser(`${user.firstName} ${user.lastName}`);
      },
      (error: Error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        setError(error.message);
        setReconnectFailed(true);
      }
    );
  }, [user]);

  // Inicjalizacja przy ładowaniu komponenta
  useEffect(() => {
    if (user) {
      // Najpierw pobierz historię wiadomości
      fetchMessages(0, false);
      
      // Następnie połącz się z WebSocket
      initializeWebSocket();
    }

    return () => {
      ChatService.disconnect();
    };
  }, [user, fetchMessages, initializeWebSocket]);  const sendMessage = useCallback((content: string) => {

    if (!user || !isConnected) {
      console.error('Cannot send message - user:', !!user, 'isConnected:', isConnected);
      setError('Nie można wysłać wiadomości - brak połączenia');
      return;
    }    try {
      // Wysyłaj przez WebSocket
      ChatService.sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Nie udało się wysłać wiadomości');
    }
  }, [user, isConnected]);

  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages && !isLoadingMessages) {
      const nextPage = currentPage + 1;
      fetchMessages(nextPage, true);
    }
  }, [currentPage, hasMoreMessages, isLoadingMessages, fetchMessages]);

  const reconnectToChat = useCallback(() => {
    ChatService.disconnect();
    setIsConnected(false);
    setReconnectFailed(false);
    setError(null);
    
    setTimeout(() => {
      initializeWebSocket();
    }, 1000);
  }, [initializeWebSocket]);

  const markAllAsRead = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isConnected: webSocket.isConnected, 
      error: webSocket.error, 
      unreadMessages,
      markAllAsRead,
      reconnectFailed,
      reconnectToChat,
      loadMoreMessages,
      hasMoreMessages,
      isLoadingMessages
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
