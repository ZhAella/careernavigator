import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  userId?: number;
}

export default function AIChat({ userId }: AIChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Greetings, cosmic traveler! I am ARIA, your AI Career Navigator. I'm here to guide you through the quantum field of career opportunities. How may I assist your journey through the professional cosmos today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", `/api/users/${userId}/chat`, {
        messages: newMessages,
      });
      
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Communication Error",
        description: "Failed to connect with ARIA. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      setMessages([...newMessages, {
        role: "assistant",
        content: "I apologize, but I'm experiencing some interference in the quantum communication channels. Please try your message again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!userId) {
    return (
      <Card className="glass-panel border-neon h-96">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-center">
            <Bot className="h-16 w-16 text-neon-blue mx-auto mb-4 opacity-50" />
            <p className="text-cyber-gray">Upload your neural profile to chat with ARIA</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-neon h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-neon-blue flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          ARIA - AI Career Mentor
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role === "user" ? "user" : "ai"}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-neon-blue/20 text-neon-blue" 
                      : "bg-plasma-green/20 text-plasma-green"
                  }`}>
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message ai">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-plasma-green/20 text-plasma-green flex items-center justify-center flex-shrink-0">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-cyber-gray">ARIA is analyzing your query...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 pt-3 border-t border-neon-blue/30">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask ARIA about your career journey..."
              className="form-input flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="cyber-button px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
