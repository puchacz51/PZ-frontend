import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage, ChatMessagePayload } from "@/types/chat";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  isConnected: boolean;
  error: string | null;
  unreadMessages: number;
  markAllAsRead: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user } = useUser();

  const initializeSocket = useCallback(() => {
    if (!user) return null;
    
    const newSocket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      auth: {
        userId: user.id,
      },
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", () => {
      setError("Nie można połączyć się z serwerem czatu.");
      setIsConnected(false);
    });

    newSocket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      
      if (message.sender.id !== user.id) {
        setUnreadMessages(prev => prev + 1);
        
        toast.info(
          <div>
            <p className="font-bold">{message.sender.firstName} {message.sender.lastName}</p>
            <p className="text-sm truncate">{message.content}</p>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    });

    newSocket.on("history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    return newSocket;
  }, [user]);

  useEffect(() => {
    let newSocket: Socket | null = null;
    
    if (user) {
      newSocket = initializeSocket();
      if (newSocket) setSocket(newSocket);
    }
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, initializeSocket]);

  const sendMessage = (content: string) => {
    if (!socket || !user) return;

    const messagePayload: ChatMessagePayload = {
      content,
      sender: user,
    };

    socket.emit("message", messagePayload);
  };
  
  const markAllAsRead = () => {
    setUnreadMessages(0);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isConnected, 
      error, 
      unreadMessages,
      markAllAsRead
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
