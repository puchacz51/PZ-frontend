import ChatMessage from "./ChatMessage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"
import { useChat } from "@/context/ChatContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

const ChatWindow = () => {
  const { messages, isConnected } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ScrollArea className="flex-1 px-2 py-4 bg-black">
      {messages.length === 0 && isConnected && (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
          <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
          <h3 className="text-lg font-medium">Żadnych wiadomości</h3>
          <p>Bądź pierwszą osobą, która rozpocznie rozmowę!</p>
        </div>
      )}
      
      {messages.length === 0 && !isConnected && (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
          <Card className="bg-black/40 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-center">Łączenie z serwerem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </ScrollArea>
  )
}

export default ChatWindow
