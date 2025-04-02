import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/context/UserContext"
import { ChatMessage as ChatMessageType } from "@/types/chat"
import { format } from "date-fns"

interface ChatMessageProps {
  message: ChatMessageType
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useUser()
  const isCurrentUser = user?.id === message.sender.id

  return (
    <div className={`flex w-full mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-3 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
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
        <div className={`rounded-xl px-4 py-2 text-sm ${
          isCurrentUser 
            ? "bg-blue-600/30 border border-blue-700/50"
            : "bg-white/10 border border-white/20"
        }`}>
          {!isCurrentUser && (
            <p className="text-xs font-medium text-white/70 mb-1">
              {message.sender.firstName} {message.sender.lastName}
            </p>
          )}
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <span className="block mt-1 text-[10px] text-white/50">
            {format(new Date(message.timestamp), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
