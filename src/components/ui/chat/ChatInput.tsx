import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Send } from "lucide-react"

const ChatInput = () => {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    console.log("Sending:", input)
    setInput("")
  }

  return (
    <div className="flex gap-2 p-4 bg-black border-t border-white/10">
      <Input
        className="flex-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Napisz wiadomość..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={handleSend} className="hover:invert">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ChatInput
