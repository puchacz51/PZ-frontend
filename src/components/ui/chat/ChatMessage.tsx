import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: {
    sender: {
      firstName: string
      lastName: string
      avatarUrl?: string
    }
    message: string
    timestamp: string
  }
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender.firstName === "Jan"

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-white transition-all">
          {message.sender.avatarUrl ? (
            <AvatarImage src={message.sender.avatarUrl} alt="user avatar" />
          ) : (
            <AvatarFallback className="bg-white/20 text-white font-semibold uppercase">
              {message.sender.firstName?.charAt(0)}
              {message.sender.lastName?.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className={`rounded-xl px-4 py-2 text-sm bg-white/10`}>
          <p>{message.message}</p>
          <span className="block mt-1 text-[10px] text-white/50">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
