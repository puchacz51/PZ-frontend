import { IUser } from "./user";

export interface ChatMessage {
  id: string;
  content: string;
  sender: IUser;
  timestamp: string;
}

export interface ChatMessagePayload {
  content: string;
  sender: IUser;
}
