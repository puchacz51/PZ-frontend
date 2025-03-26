import ChatMessage from "./ChatMessage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

const mockUser = {
  firstName: "Jan",
  lastName: "Kowalski",
  avatarUrl: ""
}

const mockBot = {
  firstName: "AI",
  lastName: "Bot",
  avatarUrl: ""
}

const sampleMessages = [
  {
    id: 1,
    sender: mockUser,
    message: "Witaj! Co nowego?",
    timestamp: "2025-03-26T15:30:00Z"
  },
  {
    id: 2,
    sender: mockBot,
    message: "Dzień dobry. Właśnie przetwarzam dane.",
    timestamp: "2025-03-26T15:31:00Z"
  }
]

const ChatWindow = () => {
  const [messages] = useState(sampleMessages)

  return (
    <ScrollArea className="flex-1 p-6 space-y-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </ScrollArea>
  )
}

export default ChatWindow
