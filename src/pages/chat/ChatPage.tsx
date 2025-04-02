import ChatWindow from "@/components/ui/chat/ChatWindow"
import ChatInput from "@/components/ui/chat/ChatInput"
import { useEffect } from "react"
import { useChat } from "@/context/ChatContext"

const ChatPage = () => {
  const { markAllAsRead } = useChat();
  
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  return (
    <div className="flex flex-col w-full h-[94vh] bg-black text-white">
      <div className="flex-1 w-full flex flex-col h-full">
        <div className="border-b border-white/10 p-4">
          <h1 className="text-xl font-semibold">Czat zespołu</h1>
          <p className="text-sm text-white/60">Komunikuj się z całym zespołem w czasie rzeczywistym</p>
        </div>
        {/* 🔧 Fixed height container with proper flex structure */}
        <div className="flex flex-col h-[calc(94vh-72px)]">
          <ChatWindow />
          <ChatInput />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
