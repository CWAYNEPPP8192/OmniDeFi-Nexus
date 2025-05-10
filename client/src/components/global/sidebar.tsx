import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  ArrowRightLeft, 
  TrendingUp, 
  PieChart, 
  Bot, 
  Sliders 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [location] = useLocation();

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <ChartLine className="w-5 h-5" />,
      active: location === "/"
    },
    { 
      name: "Cross-Chain Swaps", 
      path: "/cross-chain-swaps", 
      icon: <ArrowRightLeft className="w-5 h-5" />,
      active: location === "/cross-chain-swaps"
    },
    { 
      name: "Yield Dashboard", 
      path: "/yield-dashboard", 
      icon: <TrendingUp className="w-5 h-5" />,
      active: location === "/yield-dashboard"
    },
    { 
      name: "Portfolio", 
      path: "/portfolio", 
      icon: <PieChart className="w-5 h-5" />,
      active: location === "/portfolio"
    },
    { 
      name: "AI Assistant", 
      path: "/ai-assistant", 
      icon: <Bot className="w-5 h-5" />,
      active: location === "/ai-assistant"
    },
    { 
      name: "Settings", 
      path: "/settings", 
      icon: <Sliders className="w-5 h-5" />,
      active: location === "/settings"
    }
  ];

  const chains = [
    { name: "Ethereum", symbol: "E", color: "bg-blue-500" },
    { name: "Polygon", symbol: "P", color: "bg-purple-500" },
    { name: "Solana", symbol: "S", color: "bg-green-500" },
    { name: "Add Chain", symbol: "+", color: "bg-yellow-500" }
  ];

  return (
    <aside 
      className={cn(
        "w-64 flex flex-col bg-card border-r border-border h-full overflow-y-auto transition-all duration-300 ease-in-out",
        !isOpen && "hidden md:flex"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">OmniDeFi</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}>
                <a className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg",
                  item.active 
                    ? "text-white bg-primary/20 border border-primary/20" 
                    : "text-muted-foreground hover:bg-muted"
                )}>
                  <span className={cn(item.active ? "text-primary" : "text-muted-foreground")}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">Your Chains</h3>
          <ul className="space-y-1">
            {chains.map((chain) => (
              <li key={chain.name}>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                  <div className={`w-5 h-5 rounded-full ${chain.color} flex items-center justify-center`}>
                    <span className="text-xs">{chain.symbol}</span>
                  </div>
                  <span>{chain.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-background rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
