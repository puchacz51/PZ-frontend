import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Send } from "lucide-react"
import { useChat } from "@/context/ChatContext"
import { useUser } from "@/context/UserContext"

const ChatInput = () => {
  const [input, setInput] = useState("")
  const { sendMessage, isConnected, error } = useChat()
  const { user } = useUser()

  if (error) {
    console.error("Chat error:", error)
  } 

  const handleSend = () => {
    if (!input.trim() || !isConnected || !user) return
    
    sendMessage(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 bg-black border-t border-white/10 sticky bottom-0 w-full">
      <div className="flex gap-2">
        <Input
          className="flex-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={isConnected ? "Napisz wiadomość..." : "Łączenie z serwerem czatu..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected || !user}
        />
        <Button 
          onClick={handleSend} 
          className="hover:invert"
          disabled={!isConnected || !user || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default ChatInput
