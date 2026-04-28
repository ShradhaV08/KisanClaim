"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

function getMessageText(parts: Array<{ type: string; text?: string }> | undefined): string {
  if (!parts || !Array.isArray(parts)) return ""
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "streaming") return
    sendMessage({ text: input })
    setInput("")
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat assistant</span>
      </Button>
    )
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-96 shadow-2xl z-50 transition-all duration-200",
      isMinimized ? "h-14" : "h-[500px]"
    )}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-sm font-medium">KisanMitra</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-[380px] p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Bot className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Namaste! I&apos;m KisanMitra
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your AI assistant for agricultural insurance. Ask me about plans, coverage, claims, or any other questions!
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {["What plans are available?", "How to file a claim?", "Coverage for drought?"].map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setInput(q)
                        }}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const text = getMessageText(message.parts)
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          {text}
                        </div>
                        {message.role === "user" && (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {status === "streaming" && (
                    <div className="flex gap-2 justify-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <div className="rounded-lg px-3 py-2 bg-muted">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={status === "streaming"}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || status === "streaming"}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
