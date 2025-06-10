export const WEBSOCKET_CONFIG = {
  url: import.meta.env.VITE_SOCKET_URL || "http://localhost:8080",
  endpoints: {
    connect: "/ws",
    sendMessage: "/app/chat.sendMessage",
    addUser: "/app/chat.addUser"
  },
  topics: {
    public: "/topic/public",
    project: (id: number) => `/topic/project/${id}`
  },
  options: {
    reconnectDelay: 1000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  }
} as const;
