import { useState, useEffect } from 'react';
import { Search, TrendingUp, Wallet, Bot, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  category: string;
}

const searchData: SearchResult[] = [
  {
    id: '1',
    title: 'Dashboard Overview',
    description: 'View your portfolio and trading summary',
    icon: TrendingUp,
    path: '/dashboard/overview',
    category: 'Pages'
  },
  {
    id: '2',
    title: 'Trading Signals',
    description: 'Real-time trading signals and analysis',
    icon: TrendingUp,
    path: '/dashboard/signals',
    category: 'Pages'
  },
  {
    id: '3',
    title: 'Wallet',
    description: 'Manage your crypto assets and transactions',
    icon: Wallet,
    path: '/dashboard/wallet',
    category: 'Pages'
  },
  {
    id: '4',
    title: 'Trading Bots',
    description: 'Configure and manage automated trading bots',
    icon: Bot,
    path: '/dashboard/bots',
    category: 'Pages'
  },
  {
    id: '5',
    title: 'Profile',
    description: 'Manage your account settings',
    icon: FileText,
    path: '/dashboard/profile',
    category: 'Pages'
  },
  {
    id: '6',
    title: 'Support',
    description: 'Get help and submit tickets',
    icon: FileText,
    path: '/dashboard/support',
    category: 'Pages'
  },
  {
    id: '7',
    title: 'Meme Coins',
    description: 'Trade popular meme cryptocurrencies',
    icon: TrendingUp,
    path: '/dashboard/meme-coins',
    category: 'Pages'
  },
  {
    id: '8',
    title: 'Airdrop',
    description: 'Participate in crypto airdrops',
    icon: TrendingUp,
    path: '/dashboard/airdrop',
    category: 'Pages'
  }
];

export function SearchDialog({ isMobile = false }: { isMobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === '') {
      setResults(searchData);
      return;
    }

    const filtered = searchData.filter(
      item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <Button variant="ghost" size="sm">
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search... (Ctrl+K)"
              className="pl-10 pr-4 cursor-pointer"
              readOnly
              onClick={() => setOpen(true)}
            />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Type to search..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-2">
            {results.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              results.map((result) => {
                const Icon = result.icon;
                return (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleSelect(result.path)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.description}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.category}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
