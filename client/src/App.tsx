import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CrossChainSwaps from "@/pages/cross-chain-swaps";
import YieldDashboard from "@/pages/yield-dashboard";
import AiAssistant from "@/pages/ai-assistant";
import Portfolio from "@/pages/portfolio";
import Settings from "@/pages/settings";

import Sidebar from "@/components/global/sidebar";
import Header from "@/components/global/header";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto p-4 bg-background">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/cross-chain-swaps" component={CrossChainSwaps} />
              <Route path="/yield-dashboard" component={YieldDashboard} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/ai-assistant" component={AiAssistant} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
