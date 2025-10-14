import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Coins, Clock, TrendingUp } from 'lucide-react';

const airdrops = [
  {
    id: 1,
    name: 'Bitcoin Rewards',
    amount: '0.005 BTC',
    status: 'pending',
    claimBy: '2025-10-15',
    description: 'Earn Bitcoin rewards for platform activity',
    value: '$250',
  },
  {
    id: 2,
    name: 'Ethereum Bonus',
    amount: '0.15 ETH',
    status: 'available',
    claimBy: '2025-10-20',
    description: 'Special ETH airdrop for early adopters',
    value: '$420',
  },
  {
    id: 3,
    name: 'USDT Cashback',
    amount: '100 USDT',
    status: 'claimed',
    claimBy: '2025-09-28',
    description: 'Trading volume milestone cashback',
    value: '$100',
  },
  {
    id: 4,
    name: 'SOL Airdrop',
    amount: '5 SOL',
    status: 'available',
    claimBy: '2025-10-25',
    description: 'Referral program rewards in Solana',
    value: '$850',
  },
];

export default function Airdrop() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'claimed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Airdrop Rewards
        </h1>
        <p className="text-muted-foreground">
          Claim your exclusive crypto airdrops and bonuses
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Total Airdrops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Available for claim</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,620</div>
            <p className="text-xs text-muted-foreground">Unclaimed rewards</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Claimed This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$100</div>
            <p className="text-xs text-muted-foreground">1 airdrop claimed</p>
          </CardContent>
        </Card>
      </div>

      {/* Airdrop List */}
      <div className="grid grid-cols-1 gap-4">
        {airdrops.map((airdrop) => (
          <Card
            key={airdrop.id}
            className="hover:shadow-lg transition-all duration-300 hover:border-primary/50"
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{airdrop.name}</CardTitle>
                    <Badge className={getStatusColor(airdrop.status)}>
                      {airdrop.status}
                    </Badge>
                  </div>
                  <CardDescription>{airdrop.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {airdrop.amount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ {airdrop.value}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Claim by: {airdrop.claimBy}</span>
                </div>
                <Button
                  disabled={airdrop.status === 'claimed' || airdrop.status === 'pending'}
                  className="w-full md:w-auto"
                >
                  {airdrop.status === 'claimed'
                    ? 'Claimed'
                    : airdrop.status === 'pending'
                    ? 'Processing'
                    : 'Claim Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            How to Earn More Airdrops
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Complete trading volume milestones</p>
          <p>• Refer friends to the platform</p>
          <p>• Participate in platform activities and events</p>
          <p>• Hold platform tokens for exclusive drops</p>
          <p>• Stay active and engage with the community</p>
        </CardContent>
      </Card>
    </div>
  );
}
