import SockJS from 'sockjs-client';
import { Stomp, Client } from '@stomp/stompjs';
import { WebSocketMessage } from '@/types/chat';

class ChatService {
  private stompClient: Client | null = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  connect(
    token: string, 
    onMessageReceived: (message: WebSocketMessage) => void, 
    onConnected: () => void, 
    onError: (error: Error) => void
  ): void {
    try {
      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);
      
      // Wyłączenie logów STOMP (opcjonalne)
      this.stompClient.debug = () => {};
      
      // Konfiguracja nagłówków z tokenem JWT
      const headers = {
        'Authorization': `Bearer ${token}`
      };      this.stompClient.onConnect = () => {
        console.log('WebSocket connected successfully');
        this.isConnected = true;
        this.connectionAttempts = 0;
        
        // Subskrypcja na kanał publiczny
        this.stompClient?.subscribe('/topic/public', (message) => {
          try {
            const chatMessage = JSON.parse(message.body) as WebSocketMessage;
            onMessageReceived(chatMessage);
          } catch (parseError) {
            console.error('Failed to parse WebSocket message:', parseError, message.body);
          }
        });
        
        onConnected();
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        console.error('STOMP error details:', frame.body);
        this.isConnected = false;
        this.handleConnectionError(token, onMessageReceived, onConnected, onError);
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.handleConnectionError(token, onMessageReceived, onConnected, onError);
      };

      this.stompClient.connectHeaders = headers;
      this.stompClient.activate();
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      onError(error as Error);
    }
  }

  private handleConnectionError(
    token: string,
    onMessageReceived: (message: WebSocketMessage) => void,
    onConnected: () => void,
    onError: (error: Error) => void
  ): void {
    this.connectionAttempts++;
    
    if (this.connectionAttempts < this.maxReconnectAttempts) {
      console.log(`Attempting to reconnect... (${this.connectionAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect(token, onMessageReceived, onConnected, onError);
      }, this.reconnectDelay * this.connectionAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      onError(new Error('Nie udało się połączyć z serwerem czatu po 5 próbach.'));
    }
  }  sendMessage(messageContent: string): void {
    try {      
      if (this.stompClient && this.isConnected) {
        const chatMessage = {
          content: messageContent,
          type: 'CHAT'
        };
        
        this.stompClient.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(chatMessage)
        });
        console.log('Message sent successfully:', messageContent.substring(0, 20));
      } else {
        console.error('WebSocket not connected - isConnected:', this.isConnected, 'stompClient:', !!this.stompClient);
        throw new Error('WebSocket is not connected');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  addUser(userName: string): void {
    if (this.stompClient && this.isConnected) {
      const chatMessage = {
        senderName: userName,
        type: 'JOIN'
      };
      
      this.stompClient.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(chatMessage)
      });
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.isConnected = false;
      this.connectionAttempts = 0;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  reconnect(
    token: string,
    onMessageReceived: (message: WebSocketMessage) => void,
    onConnected: () => void,
    onError: (error: Error) => void
  ): void {
    this.disconnect();
    this.connectionAttempts = 0;
    this.connect(token, onMessageReceived, onConnected, onError);
  }
}

export default new ChatService();
