import { Button } from "@/components/ui/button";
import { Plus, Bell, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const [location] = useLocation();
  
  const pageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/cross-chain-swaps":
        return "Cross-Chain Swaps";
      case "/yield-dashboard":
        return "Yield Dashboard";
      case "/portfolio":
        return "Portfolio";
      case "/ai-assistant":
        return "AI Assistant";
      case "/settings":
        return "Settings";
      default:
        return "OmniDeFi Nexus";
    }
  };

  const { data: balanceData } = useQuery({
    queryKey: ['/api/balance'],
    enabled: false, // Disable this query until we have actual API
  });

  const userBalance = balanceData?.balance || "$3,245.89";

  return (
    <header className="bg-card border-b border-border py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-muted-foreground hover:text-foreground md:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">{pageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex items-center bg-background p-2 rounded-lg border border-border">
              <span className="text-green-500 font-mono">{userBalance}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2 text-green-500">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            <span>Connect Wallet</span>
          </Button>
          <div className="relative">
            <button className="p-2 text-muted-foreground hover:text-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
