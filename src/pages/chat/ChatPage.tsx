import ChatWindow from "@/components/ui/chat/ChatWindow"
import ChatInput from "@/components/ui/chat/ChatInput"

const ChatPage = () => {
  return (
    <div className="flex flex-col w-full h-[94vh] bg-black text-white">
      <div className="flex-1 w-full flex flex-col justify-between">
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  )
}

export default ChatPage
