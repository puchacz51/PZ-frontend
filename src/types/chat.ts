import { IUser, mockUsers } from "./user";

export interface ChatMessage {
  id: string;
  content: string;
  sender: IUser
  timestamp: string;
  projectId?: number;
}

export interface ChatMessagePayload {
  content: string;
  sender: IUser;  // Change from senderId to the complete user object
  projectId?: number;
}

// Mock data
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg1",
    content: "Hey team, I just pushed the latest changes to the repository.",
    sender: mockUsers[0],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    projectId: 1
  },
  {
    id: "msg2",
    content: "Great! I'll pull the changes and review them shortly.",
    sender: mockUsers[1],
    timestamp: new Date(Date.now() - 3540000).toISOString(),
    projectId: 1
  },
  {
    id: "msg3",
    content: "By the way, I found an issue with the authentication module. Can we discuss it in the next meeting?",
    sender: mockUsers[2],
    timestamp: new Date(Date.now() - 3480000).toISOString(),
    projectId: 1
  },
  {
    id: "msg4",
    content: "Sure, let's discuss it. Can you provide more details about the issue?",
    sender: mockUsers[0],
    timestamp: new Date(Date.now() - 3420000).toISOString(),
    projectId: 1
  },
  {
    id: "msg5",
    content: "The token validation is failing when the user has specific roles. I'll prepare a detailed report.",
    sender: mockUsers[2],
    timestamp: new Date(Date.now() - 3360000).toISOString(),
    projectId: 1
  }
];
