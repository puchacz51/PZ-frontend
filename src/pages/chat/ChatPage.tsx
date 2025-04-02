import ChatWindow from "@/components/ui/chat/ChatWindow"
import ChatInput from "@/components/ui/chat/ChatInput"
import { useEffect } from "react"
import { useChat } from "@/context/ChatContext"
import { ChatProvider } from "@/context/ChatContext"

const ChatPage = () => {
  const { markAllAsRead } = useChat();
  
  useEffect(() => {
    // Mark all messages as read when the chat page is opened
    markAllAsRead();
  }, [markAllAsRead]);

  return (
    <ChatProvider>
      <div className="flex flex-col w-full h-[94vh] bg-black text-white">
        <div className="flex-1 w-full flex flex-col justify-between">
          <div className="border-b border-white/10 p-4">
            <h1 className="text-xl font-semibold">Czat zespołu</h1>
            <p className="text-sm text-white/60">Komunikuj się z całym zespołem w czasie rzeczywistym</p>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow />
            <ChatInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}

export default ChatPage
