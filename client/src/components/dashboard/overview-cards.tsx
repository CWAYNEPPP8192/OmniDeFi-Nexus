import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OverviewCardData } from "@/lib/types";

const overviewCards: OverviewCardData[] = [
  {
    title: "Total Value Locked",
    value: "$12,874,392",
    change: {
      value: "12.4%",
      isPositive: true
    },
    info: "Across 20+ chains",
    tooltip: "Sum of all assets across all supported chains"
  },
  {
    title: "24h Trading Volume",
    value: "$943,582",
    change: {
      value: "5.2%",
      isPositive: false
    },
    info: "8.4k transactions",
    tooltip: "Total volume in the last 24 hours"
  },
  {
    title: "Gas Fees Saved",
    value: "$283,951",
    change: {
      value: "34.1%",
      isPositive: true
    },
    info: "Via gasless transactions",
    tooltip: "Gas fees saved using OKX's Gasless API"
  },
  {
    title: "Avg. APY",
    value: "12.76%",
    change: {
      value: "0.2%",
      isPositive: true,
      neutral: true
    },
    info: "Across all yield pools",
    tooltip: "Average annual percentage yield"
  }
];

const OverviewCard = ({ card }: { card: OverviewCardData }) => {
  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-muted-foreground text-sm font-medium">{card.title}</h3>
          <span className={`text-xs ${
            card.change.neutral 
              ? "text-yellow-500 bg-yellow-500/10" 
              : card.change.isPositive 
                ? "text-green-500 bg-green-500/10" 
                : "text-red-500 bg-red-500/10"
          } px-2 py-1 rounded-full`}>
            {card.change.isPositive ? "↑" : "↓"} {card.change.value}
          </span>
        </div>
        <div className="font-mono text-2xl font-medium mb-2">{card.value}</div>
        <div className="flex items-center text-muted-foreground text-xs">
          <span>{card.info}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="ml-1 text-muted-foreground h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{card.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

const OverviewCardSkeleton = () => {
  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-28 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
};

const OverviewCards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/overview"],
    enabled: false, // Disable for now since we're using static data
  });

  // Use static data for now
  const cardsData = data || overviewCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {isLoading
        ? Array(4).fill(0).map((_, i) => <OverviewCardSkeleton key={i} />)
        : cardsData.map((card, index) => (
            <OverviewCard key={index} card={card} />
          ))
      }
    </div>
  );
};

export default OverviewCards;
