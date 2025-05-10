import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Bot, Layers, RefreshCw } from "lucide-react";
import { fetchAiRecommendation } from "@/lib/api";
import { ChatMessage } from "@/lib/types";

interface AssistantChatProps {
  conversation: ChatMessage[];
  setConversation: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
}

const AssistantChat = ({ conversation, setConversation, isLoading }: AssistantChatProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const recommendationMutation = useMutation({
    mutationFn: fetchAiRecommendation,
    onMutate: (prompt) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        content: prompt,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, userMessage]);
      setPrompt("");
    },
    onSuccess: (data) => {
      // Format the response from the AI
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        recommendations: data.recommendations
      };
      
      setConversation(prev => [...prev, aiMessage]);
      queryClient.invalidateQueries({ queryKey: ['/api/ai/conversations'] });
    },
    onError: (error) => {
      toast({
        title: "Error getting recommendation",
        description: error.message || "Failed to get AI recommendation",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    recommendationMutation.mutate(prompt);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto h-80"
      >
        {conversation.map((message) => (
          <div key={message.id} className={`flex items-start ${message.sender === 'assistant' ? '' : 'justify-end'}`}>
            {message.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-primary flex items-center justify-center mr-3 flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`${
              message.sender === 'assistant' 
                ? 'bg-background rounded-lg p-3 max-w-xs sm:max-w-sm' 
                : 'bg-primary/10 rounded-lg p-3 max-w-xs sm:max-w-sm'
            }`}>
              <p className="text-sm">{message.content}</p>
              
              {message.recommendations && (
                <div className="mt-2 space-y-2">
                  {message.recommendations.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`bg-card rounded-lg p-2 text-xs ${option.isRecommended ? 'border border-green-500' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={option.isRecommended ? 'font-medium text-green-500' : ''}>
                          {option.isRecommended && '✓ '}
                          {option.name}
                        </span>
                        <span className={option.isRecommended ? 'text-green-500' : 'text-yellow-500'}>
                          {option.fee} fee
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{option.value}</span>
                        <Layers className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center ml-3 flex-shrink-0">
                <span className="text-xs text-white">JD</span>
              </div>
            )}
          </div>
        ))}
        
        {recommendationMutation.isPending && (
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-primary flex items-center justify-center mr-3 flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card className="bg-background p-3 max-w-xs sm:max-w-sm animate-pulse">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about cross-chain swaps, yields, risks..."
            className="w-full bg-background rounded-lg pl-4 pr-10 py-3 focus-visible:ring-primary"
            disabled={recommendationMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary bg-transparent hover:bg-transparent"
            disabled={!prompt.trim() || recommendationMutation.isPending}
          >
            <Layers className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AssistantChat;
