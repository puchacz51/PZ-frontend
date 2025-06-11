import ChatMessage from "./ChatMessage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import { useChat } from "@/context/ChatContext"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { MessageCircle, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const ChatWindow = () => {
  const { 
    messages, 
    isConnected, 
    reconnectFailed, 
    reconnectToChat,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingHistory
  } = useChat()
  
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [lastMessageCount, setLastMessageCount] = useState(0)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > lastMessageCount && shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    setLastMessageCount(messages.length)
  }, [messages.length, shouldScrollToBottom, lastMessageCount])

  // Handle scroll to detect if user scrolled up
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = element
    
    // Check if user is at the bottom
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10
    setShouldScrollToBottom(isAtBottom)
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const currentScrollHeight = scrollHeight
      fetchNextPage?.().then(() => {
        // Maintain scroll position after loading new messages
        setTimeout(() => {
          if (scrollAreaRef.current) {
            const newScrollHeight = scrollAreaRef.current.scrollHeight
            scrollAreaRef.current.scrollTop = newScrollHeight - currentScrollHeight
          }
        }, 100)
      })
    }
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea 
        className="h-full px-2 py-4 bg-black"
        ref={scrollAreaRef}
        onScrollCapture={handleScroll}
      >
        {/* Loading indicator for fetching more messages */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Ładowanie starszych wiadomości...</span>
            </div>
          </div>
        )}

        {/* Initial loading state */}
        {isLoadingHistory && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
            <Card className="bg-black/40 border border-white/10 min-w-[300px]">
              <CardHeader>
                <CardTitle className="text-white text-center">Ładowanie historii czatu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && isConnected && !isLoadingHistory && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60">
            <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">Żadnych wiadomości</h3>
            <p>Bądź pierwszą osobą, która rozpocznie rozmowę!</p>
          </div>
        )}
        
        {/* Connection states */}
        {messages.length === 0 && !isConnected && !reconnectFailed && !isLoadingHistory && (
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
        
        {messages.length === 0 && reconnectFailed && !isLoadingHistory && (
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

        {/* Messages */}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  )
}

export default ChatWindow
