import ChatMessage from "./ChatMessage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"
import { useChat } from "@/context/ChatContext"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { MessageCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const ChatWindow = () => {
  const { messages, isConnected, reconnectFailed, reconnectToChat, loadMoreMessages, hasMoreMessages, isLoadingMessages } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full px-2 py-4 bg-black">
        {hasMoreMessages && (
          <div className="flex justify-center mb-4">
            <Button 
              onClick={loadMoreMessages} 
              disabled={isLoadingMessages}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {isLoadingMessages ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Ładowanie...
                </>
              ) : (
                'Załaduj więcej wiadomości'
              )}
            </Button>
          </div>
        )}
        
        {messages.length === 0 && isConnected && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
            <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">Żadnych wiadomości</h3>
            <p>Bądź pierwszą osobą, która rozpocznie rozmowę!</p>
          </div>
        )}
        
        {messages.length === 0 && !isConnected && !reconnectFailed && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
            <Card className="bg-black/40 border border-white/10 min-w-[300px]">
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
        
        {messages.length === 0 && reconnectFailed && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
            <Card className="bg-black/40 border border-red-500/50 min-w-[300px]">
              <CardHeader>
                <CardTitle className="text-white text-center">Problem z połączeniem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-400 mb-4">Nie udało się połączyć z serwerem czatu po 5 próbach.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  onClick={reconnectToChat} 
                  className="bg-white/10 hover:bg-white text-white hover:text-black"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Odśwież połączenie
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  )
}

export default ChatWindow
