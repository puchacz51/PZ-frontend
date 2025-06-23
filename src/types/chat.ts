import { mockUsers } from "./user";

export interface ChatMessage {
  id: number; // Zgodnie z dokumentacją - ID jest liczbą
  content: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  timestamp: string;
  projectId?: number;
}

export interface ChatMessagePayload {
  content: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  projectId?: number;
}

// Mock data
export const mockChatMessages: ChatMessage[] = [
  {
    id: 1,
    content: "Hey team, I just pushed the latest changes to the repository.",
    sender: {
      id: mockUsers[0].id,
      firstName: mockUsers[0].firstName,
      lastName: mockUsers[0].lastName,
      email: mockUsers[0].email,
      avatarUrl: mockUsers[0].avatarUrl
    },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    projectId: 1
  },
  {
    id: 2,
    content: "Great! I'll pull the changes and review them shortly.",
    sender: {
      id: mockUsers[1].id,
      firstName: mockUsers[1].firstName,
      lastName: mockUsers[1].lastName,
      email: mockUsers[1].email,
      avatarUrl: mockUsers[1].avatarUrl
    },
    timestamp: new Date(Date.now() - 3540000).toISOString(),
    projectId: 1
  },
  {
    id: 3,
    content: "By the way, I found an issue with the authentication module. Can we discuss it in the next meeting?",
    sender: {
      id: mockUsers[2].id,
      firstName: mockUsers[2].firstName,
      lastName: mockUsers[2].lastName,
      email: mockUsers[2].email,
      avatarUrl: mockUsers[2].avatarUrl
    },
    timestamp: new Date(Date.now() - 3480000).toISOString(),
    projectId: 1
  },
  {
    id: 4,
    content: "Sure, let's discuss it. Can you provide more details about the issue?",
    sender: {
      id: mockUsers[0].id,
      firstName: mockUsers[0].firstName,
      lastName: mockUsers[0].lastName,
      email: mockUsers[0].email,
      avatarUrl: mockUsers[0].avatarUrl
    },
    timestamp: new Date(Date.now() - 3420000).toISOString(),
    projectId: 1
  },
  {
    id: 5,
    content: "The token validation is failing when the user has specific roles. I'll prepare a detailed report.",
    sender: {
      id: mockUsers[2].id,
      firstName: mockUsers[2].firstName,
      lastName: mockUsers[2].lastName,
      email: mockUsers[2].email,
      avatarUrl: mockUsers[2].avatarUrl
    },
    timestamp: new Date(Date.now() - 3360000).toISOString(),
    projectId: 1
  }
];

export interface WebSocketMessage {
  type: 'CHAT' | 'JOIN' | 'ERROR';
  content: string;
  senderEmail?: string;
  senderName?: string;
  senderId?: number;
  senderFirstName?: string;
  senderLastName?: string;
  senderAvatarUrl?: string;
  timestamp: string;
}

export interface WebSocketSendMessage {
  content: string;
  type: 'CHAT';
}

export interface WebSocketJoinMessage {
  senderName: string;
  type: 'JOIN';
}
