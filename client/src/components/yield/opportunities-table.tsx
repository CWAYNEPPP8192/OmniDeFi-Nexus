import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { YieldOpportunityData } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { depositToYield } from "@/lib/api";

interface OpportunitiesTableProps {
  data?: YieldOpportunityData[];
  isLoading: boolean;
}

// Default data for demo
const defaultData: YieldOpportunityData[] = [
  {
    protocol: "Aave V3",
    protocolSymbol: "A",
    protocolColor: "bg-blue-500",
    asset: "USDC",
    assetSymbol: "U",
    assetColor: "bg-gray-200",
    chain: "Polygon",
    chainSymbol: "P",
    chainColor: "bg-purple-500",
    apy: "4.32%",
    tvl: "$245.8M",
    isOptimal: false
  },
  {
    protocol: "Compound",
    protocolSymbol: "C",
    protocolColor: "bg-green-500",
    asset: "ETH",
    assetSymbol: "E",
    assetColor: "bg-blue-500",
    chain: "Ethereum",
    chainSymbol: "E",
    chainColor: "bg-blue-500",
    apy: "3.87%",
    tvl: "$1.2B",
    isOptimal: false
  },
  {
    protocol: "Lido",
    protocolSymbol: "L",
    protocolColor: "bg-yellow-500",
    asset: "stETH",
    assetSymbol: "E",
    assetColor: "bg-blue-500",
    chain: "Ethereum",
    chainSymbol: "E",
    chainColor: "bg-blue-500",
    apy: "4.86%",
    tvl: "$13.7B",
    isOptimal: false
  },
  {
    protocol: "Raydium",
    protocolSymbol: "R",
    protocolColor: "bg-red-500",
    asset: "USDC-SOL",
    assetSymbol: "U",
    assetColor: "bg-gray-200",
    chain: "Solana",
    chainSymbol: "S",
    chainColor: "bg-green-500",
    apy: "12.74%",
    tvl: "$64.9M",
    isOptimal: true
  }
];

const OpportunitiesTable = ({ data, isLoading }: OpportunitiesTableProps) => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<YieldOpportunityData | null>(null);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  
  const opportunities = data || defaultData;
  const totalPages = 12; // Mocked total pages
  
  const depositMutation = useMutation({
    mutationFn: (opportunityId: number) => depositToYield(opportunityId, depositAmount),
    onSuccess: () => {
      toast({
        title: "Deposit successful",
        description: `Successfully deposited ${depositAmount} to ${selectedOpportunity?.protocol}`,
      });
      setDepositDialogOpen(false);
      setDepositAmount("");
    },
    onError: (error) => {
      toast({
        title: "Error making deposit",
        description: error.message || "There was an error processing your deposit",
        variant: "destructive",
      });
    }
  });

  const handleDeposit = (opportunity: YieldOpportunityData) => {
    setSelectedOpportunity(opportunity);
    setDepositDialogOpen(true);
  };

  const confirmDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }
    depositMutation.mutate(opportunities.indexOf(selectedOpportunity!));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
  
  // Generate array of visible pages
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (startPage > 1) {
        pageNumbers.unshift("...");
        pageNumbers.unshift(1);
      }
      
      if (endPage < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-background/50 hover:bg-background/50">
              <TableHead className="font-medium text-xs text-muted-foreground">Protocol</TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">Asset</TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground">Chain</TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground text-right">APY</TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground text-right">TVL</TableHead>
              <TableHead className="font-medium text-xs text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <TableRow key={index} className="border-border hover:bg-background/50">
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-5 w-5 rounded-full mr-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-9 w-20 rounded-lg ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              opportunities.map((opportunity, index) => (
                <TableRow key={index} className="border-border hover:bg-background/50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${opportunity.protocolColor} flex items-center justify-center mr-2 text-white`}>
                        <span className="text-xs">{opportunity.protocolSymbol}</span>
                      </div>
                      <span>{opportunity.protocol}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full ${opportunity.assetColor} flex items-center justify-center mr-2 ${opportunity.assetColor === 'bg-gray-200' ? 'text-gray-800' : 'text-white'}`}>
                        <span className="text-xs">{opportunity.assetSymbol}</span>
                      </div>
                      <span>{opportunity.asset}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full ${opportunity.chainColor} flex items-center justify-center mr-1 text-white`}>
                        <span className="text-xs">{opportunity.chainSymbol}</span>
                      </div>
                      <span>{opportunity.chain}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-green-500">{opportunity.apy}</TableCell>
                  <TableCell className="text-right font-mono">{opportunity.tvl}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      className={opportunity.isOptimal 
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                        : "bg-primary/10 text-primary hover:bg-primary/20"} 
                      onClick={() => handleDeposit(opportunity)}
                    >
                      {opportunity.isOptimal ? "Optimal" : "Deposit"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Showing 4 of 500+ protocols</span>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-lg bg-background" 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted-foreground">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </Button>
          
          {getPageNumbers().map((pageNum, index) => (
            <Button 
              key={index}
              variant={pageNum === page ? "default" : "outline"}
              className={`w-8 h-8 rounded-lg ${pageNum === page ? "bg-primary" : "bg-background"}`}
              onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
              disabled={typeof pageNum !== 'number'}
            >
              {pageNum}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-lg bg-background" 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted-foreground">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to {selectedOpportunity?.protocol}</DialogTitle>
            <DialogDescription>
              Enter the amount you wish to deposit into this yield opportunity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ({selectedOpportunity?.asset})</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full"
                />
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => setDepositAmount("100")}
                >
                  Max
                </Button>
              </div>
            </div>
            
            <div className="bg-background p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Estimated APY</span>
                <span className="text-sm text-green-500 font-medium">{selectedOpportunity?.apy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaction Fee</span>
                <span className="text-sm text-green-500 font-medium">Gasless ($0.00)</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDepositDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDeposit}
              disabled={depositMutation.isPending || !depositAmount || parseFloat(depositAmount) <= 0}
            >
              {depositMutation.isPending ? "Processing..." : "Confirm Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpportunitiesTable;
