import { useState, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WEBSOCKET_CONFIG } from '@/config/websocket';
import { setupGlobalPolyfill } from '@/lib/utils';

setupGlobalPolyfill();

interface UseWebSocketProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = ({ onConnect, onDisconnect, onError }: UseWebSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectFailed, setReconnectFailed] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    setReconnectFailed(false);
    setError(null);
    
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WEBSOCKET_CONFIG.url}${WEBSOCKET_CONFIG.endpoints.connect}`),
      ...WEBSOCKET_CONFIG.options,
      debug: (str) => {
        console.log('STOMP: ' + str);
      }
    });

    client.onConnect = () => {
      setIsConnected(true);
      setError(null);
      setReconnectFailed(false);
      onConnect?.();
    };

    client.onStompError = () => {
      const errorMsg = "Nie można połączyć się z serwerem czatu.";
      setError(errorMsg);
      setIsConnected(false);
      setReconnectFailed(true);
      onError?.(errorMsg);
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      onDisconnect?.();
    };

    client.activate();
    clientRef.current = client;
    
    return client;
  }, [onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [disconnect, connect]);

  const publish = useCallback((destination: string, body: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body });
    }
  }, []);

  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    if (clientRef.current?.connected) {
      return clientRef.current.subscribe(destination, callback);
    }
  }, []);

  return {
    client: clientRef.current,
    isConnected,
    error,
    reconnectFailed,
    connect,
    disconnect,
    reconnect,
    publish,
    subscribe
  };
};
