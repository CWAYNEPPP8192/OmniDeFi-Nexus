import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, BrainCircuit } from "lucide-react";
import AssistantChat from "@/components/ai/assistant-chat";
import StrategyRecommendations from "@/components/ai/strategy-recommendations";
import { fetchAiConversationHistory } from "@/lib/api";
import { ChatMessage } from "@/lib/types";

const AiAssistant = () => {
  const [activeConversation, setActiveConversation] = useState<ChatMessage[]>([
    {
      id: "initial-message",
      sender: "assistant",
      content: "Hello! I can help optimize your DeFi strategy. Would you like me to analyze your portfolio or suggest yield opportunities?",
      timestamp: new Date().toISOString()
    }
  ]);

  const { data: conversationHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['/api/ai/conversations'],
    queryFn: () => fetchAiConversationHistory()
  });

  return (
    <div>
      {/* Alert Banner */}
      <Alert className="bg-primary/10 border border-primary/20 rounded-lg mb-6">
        <div className="flex items-center">
          <BrainCircuit className="h-4 w-4 text-primary mr-2" />
          <AlertDescription>
            AI Assistant helps you optimize trading strategies and navigate DeFi opportunities.
          </AlertDescription>
        </div>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-card rounded-xl shadow-lg border border-border h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="text-lg font-medium">AI Assistant</CardTitle>
                <div className="flex items-center ml-3 space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <AssistantChat 
                conversation={activeConversation}
                setConversation={setActiveConversation}
                isLoading={isLoadingHistory}
              />
            </CardContent>
          </Card>
        </div>

        {/* Strategy Recommendations */}
        <div>
          <StrategyRecommendations />
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
