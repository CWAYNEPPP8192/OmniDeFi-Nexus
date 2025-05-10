import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GasSavingsData } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface GasSavingsProps {
  data?: GasSavingsData;
  isLoading: boolean;
}

// Default data for demo
const defaultData: GasSavingsData = {
  total: "$283,951",
  transactions: 8432,
  byChain: [
    { chain: "Ethereum", amount: "$180,241", percentage: 63.5 },
    { chain: "Polygon", amount: "$54,309", percentage: 19.1 },
    { chain: "Solana", amount: "$28,395", percentage: 10.0 },
    { chain: "Arbitrum", amount: "$14,197", percentage: 5.0 },
    { chain: "Other Chains", amount: "$6,809", percentage: 2.4 }
  ]
};

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F43F5E", "#6B7280"];

const GasSavings = ({ data, isLoading }: GasSavingsProps) => {
  const gasData = data || defaultData;
  
  // Format the data for the chart
  const chartData = gasData.byChain.map(item => ({
    name: item.chain,
    value: item.percentage,
    amount: item.amount
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="bg-background border border-border p-2 shadow-lg">
          <div className="text-sm font-medium">{data.name}</div>
          <div className="text-muted-foreground text-xs">{data.amount} ({data.value}%)</div>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Gas Fees Saved</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-60 w-60 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col justify-center items-center">
              <div className="mb-4 text-center">
                <div className="text-4xl font-bold mb-1">{gasData.total}</div>
                <div className="text-muted-foreground text-sm">Total gas saved across {gasData.transactions} transactions</div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              <div className="text-lg font-medium mb-2">Savings by Chain</div>
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{item.amount}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${item.value}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="text-sm mb-1">Estimated Annual Savings</div>
                <div className="text-2xl font-bold mb-1">$1,135,804</div>
                <div className="text-xs text-muted-foreground">Based on your current trading volume and gas prices</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GasSavings;
