# System Głównego Czatu - Instrukcje Integracji

## Opis Systemu

System głównego czatu to prosty system komunikacji w czasie rzeczywistym, który umożliwia:
- Wysyłanie wiadomości w czasie rzeczywistym przez WebSocket
- Pobieranie historii wiadomości z paginacją
- Zapisywanie wszystkich wiadomości w bazie danych
- Uwierzytelnianie użytkowników przez JWT

## Endpoint REST API

### Pobieranie wiadomości (z paginacją)
```
GET /api/chat/messages?page=0&size=20
```

**Parametry:**
- `page` (opcjonalny): Numer strony (domyślnie 0)
- `size` (opcjonalny): Liczba wiadomości na stronę (domyślnie 20)

**Nagłówki:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Odpowiedź:**
```json
{
  "content": [
    {
      "id": 1,
      "content": "Treść wiadomości",
      "timestamp": "2023-12-01T10:30:00",
      "sender": {
        "id": 1,
        "firstName": "Jan",
        "lastName": "Kowalski", 
        "email": "jan@example.com",
        "avatarUrl": "http://localhost:8080/api/users/avatar/avatar.jpg"
      }
    }
  ],
  "pageable": {
    "sort": {
      "sorted": false,
      "unsorted": true
    },
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true
}
```

### Wysyłanie wiadomości przez REST API
```
POST /api/chat/send
```

**Nagłówki:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Treść wiadomości"
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "content": "Treść wiadomości",
    "timestamp": "2023-12-01T10:30:00",
    "sender": {
      "id": 1,
      "firstName": "Jan",
      "lastName": "Kowalski",
      "email": "jan@example.com",
      "avatarUrl": "http://localhost:8080/api/users/avatar/avatar.jpg"
    }
  }
}
```

## Połączenie WebSocket z React

### 1. Instalacja zależności

```bash
npm install sockjs-client @stomp/stompjs
```

### 2. Serwis WebSocket

```javascript
// services/ChatService.js
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class ChatService {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
  }

  connect(token, onMessageReceived, onConnected, onError) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    // Wyłączenie logów STOMP (opcjonalne)
    this.stompClient.debug = () => {};
    
    // Konfiguracja nagłówków z tokenem JWT
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.stompClient.connect(
      headers,
      (frame) => {
        console.log('Connected: ' + frame);
        this.isConnected = true;
        
        // Subskrypcja na kanał publiczny
        this.stompClient.subscribe('/topic/public', (message) => {
          const chatMessage = JSON.parse(message.body);
          onMessageReceived(chatMessage);
        });
        
        if (onConnected) onConnected();
      },
      (error) => {
        console.error('Connection error: ', error);
        this.isConnected = false;
        if (onError) onError(error);
      }
    );
  }

  sendMessage(messageContent) {
    if (this.stompClient && this.isConnected) {
      const chatMessage = {
        content: messageContent,
        type: 'CHAT'
      };
      
      this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
    }
  }

  addUser(userName) {
    if (this.stompClient && this.isConnected) {
      const chatMessage = {
        senderName: userName,
        type: 'JOIN'
      };
      
      this.stompClient.send('/app/chat.addUser', {}, JSON.stringify(chatMessage));
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.isConnected = false;
    }
  }
}

export default new ChatService();
```

### 3. Komponent React

```jsx
// components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import ChatService from '../services/ChatService';

const Chat = ({ token, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);

  // Pobieranie historii wiadomości
  const fetchMessages = async (pageNum = 0, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/chat/messages?page=${pageNum}&size=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (append) {
          setMessages(prev => [...data.content.reverse(), ...prev]);
        } else {
          setMessages(data.content.reverse());
        }
        setHasMore(!data.last);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inicjalizacja połączenia
  useEffect(() => {
    fetchMessages(); // Pobierz najnowsze wiadomości

    ChatService.connect(
      token,      (message) => {
        if (message.type === 'CHAT') {
          // Dodaj nową wiadomość otrzymaną przez WebSocket
          const newMsg = {
            id: Date.now(), // Tymczasowe ID
            content: message.content,
            timestamp: message.timestamp,
            sender: {
              id: message.senderId,
              email: message.senderEmail,
              firstName: message.senderFirstName,
              lastName: message.senderLastName,
              avatarUrl: message.senderAvatarUrl
            }
          };
          setMessages(prev => [...prev, newMsg]);
        }
      },
      () => {
        setConnected(true);
        // Powiadom o dołączeniu użytkownika
        ChatService.addUser(`${user.firstName} ${user.lastName}`);
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
      }
    );

    return () => {
      ChatService.disconnect();
    };
  }, [token, user]);

  // Przewijanie do dołu po dodaniu nowej wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && connected) {
      ChatService.sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, true);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Główny Czat</h3>
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? 'Połączono' : 'Rozłączono'}
        </div>
      </div>

      <div className="chat-messages">
        {hasMore && (
          <button 
            onClick={loadMoreMessages} 
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? 'Ładowanie...' : 'Załaduj więcej wiadomości'}
          </button>
        )}

        {messages.map((message, index) => (
          <div key={message.id || index} className="message">
            <div className="message-header">
              <span className="sender-name">
                {message.sender.firstName} {message.sender.lastName}
              </span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Wpisz wiadomość..."
          disabled={!connected}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!connected || !newMessage.trim()}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};

export default Chat;
```

### 4. Przykładowe style CSS

```css
/* styles/Chat.css */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.connection-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.connection-status.connected {
  background-color: #d4edda;
  color: #155724;
}

.connection-status.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.load-more-btn {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.load-more-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.sender-name {
  font-weight: bold;
  color: #007bff;
}

.timestamp {
  color: #6c757d;
}

.message-content {
  color: #333;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ddd;
  background-color: #f5f5f5;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.chat-input button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
```

## Typy wiadomości WebSocket

### Wysyłane do serwera:

1. **Wysyłanie wiadomości:**
```json
{
  "content": "Treść wiadomości",
  "type": "CHAT"
}
```

2. **Dołączenie do czatu:**
```json
{
  "senderName": "Jan Kowalski",
  "type": "JOIN"
}
```

### Otrzymywane z serwera:

1. **Nowa wiadomość:**
```json
{
  "type": "CHAT",
  "content": "Treść wiadomości",
  "senderEmail": "jan@example.com",
  "senderName": "Jan Kowalski",
  "senderId": 1,
  "senderFirstName": "Jan",
  "senderLastName": "Kowalski",
  "senderAvatarUrl": "http://localhost:8080/api/users/avatar/avatar.jpg",
  "timestamp": "2023-12-01T10:30:00"
}
```

2. **Użytkownik dołączył:**
```json
{
  "type": "JOIN",
  "content": "Jan Kowalski joined the chat!",
  "senderEmail": "jan@example.com",
  "senderName": "Jan Kowalski",
  "senderId": 1,
  "senderFirstName": "Jan",
  "senderLastName": "Kowalski",
  "senderAvatarUrl": "http://localhost:8080/api/users/avatar/avatar.jpg",
  "timestamp": "2023-12-01T10:30:00"
}
```

3. **Błąd:**
```json
{
  "type": "ERROR",
  "content": "Opis błędu",
  "timestamp": "2023-12-01T10:30:00"
}
```

## Uwagi techniczne

1. **Uwierzytelnianie:** Wszystkie połączenia WebSocket i REST API wymagają tokena JWT w nagłówku `Authorization: Bearer <TOKEN>`

2. **Paginacja:** Wiadomości są sortowane od najnowszych do najstarszych. Używaj parametrów `page` i `size` do kontroli paginacji

3. **Limit wiadomości:** Maksymalna długość wiadomości to 1000 znaków

4. **Automatyczne odświeżanie:** WebSocket automatycznie dostarcza nowe wiadomości w czasie rzeczywistym

5. **Obsługa błędów:** Sprawdzaj pole `success` w odpowiedziach REST API i obsługuj wiadomości typu `ERROR` z WebSocket

6. **Reconnection:** W przypadku utraty połączenia WebSocket, implementuj logikę ponownego łączenia po stronie frontendu
