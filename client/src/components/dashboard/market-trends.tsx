import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MarketTrendsData } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { Line } from "recharts";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MarketTrendsProps {
  data?: MarketTrendsData;
  isLoading: boolean;
}

// Default data for demo
const defaultData = {
  labels: Array.from({length: 24}, (_, i) => `${i}:00`),
  datasets: [
    {
      label: 'ETH Price',
      data: [3180, 3210, 3190, 3220, 3250, 3245, 3260, 3270, 3290, 3310, 3300, 3320, 3350, 3370, 3360, 3330, 3310, 3280, 3260, 3240, 3245, 3270, 3290, 3320],
      color: '#3B82F6'
    },
    {
      label: 'BTC Price (scaled)',
      data: [2900, 2933, 2920, 2947, 2967, 2987, 3000, 3020, 3040, 3060, 3073, 3067, 3053, 3040, 3027, 3013, 3000, 2987, 2967, 2947, 2933, 2920, 2907, 2900],
      color: '#F59E0B'
    }
  ]
};

const timeframes = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '1Y', value: '1y' }
];

const MarketTrends = ({ data, isLoading }: MarketTrendsProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const chartData = data || defaultData;
  
  // Format data for recharts
  const formattedData = chartData.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    chartData.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
          <p className="label text-xs text-muted-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Market Trends</CardTitle>
          <div className="flex items-center space-x-2">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={activeTimeframe === tf.value ? "default" : "outline"}
                className={`text-xs ${activeTimeframe === tf.value ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'} px-3 py-1 h-8 rounded-full`}
                onClick={() => setActiveTimeframe(tf.value)}
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        {isLoading ? (
          <div className="h-80 w-full flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-80 w-full px-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value, index) => index % 6 === 0 ? value : ''}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {chartData.datasets.map((dataset, index) => (
                  <Line 
                    key={index}
                    type="monotone" 
                    dataKey={dataset.label} 
                    stroke={dataset.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketTrends;
