import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AutomatedBot {
  id: string;
  name: string;
  description?: string;
  trading_pair: string;
  risk_level: string;
  is_active: boolean;
  min_balance_required: number;
  take_profit_percentage?: number;
  stop_loss_percentage?: number;
  created_at: string;
}

export function AdminBotManagement() {
  const [bots, setBots] = useState<AutomatedBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AutomatedBot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trading_pair: "",
    risk_level: "medium",
    min_balance_required: 1000,
    take_profit_percentage: 5,
    stop_loss_percentage: 3,
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const { data, error } = await supabase
        .from('automated_bots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      console.error("Error fetching automated bots:", error);
      toast({
        title: "Error",
        description: "Failed to fetch automated bots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get a default strategy_id (you may want to create a proper strategy selection)
      const { data: strategies } = await supabase
        .from('trading_strategies')
        .select('id')
        .limit(1)
        .single();

      const [base, quote] = formData.trading_pair.split('/');
      
      const botData = {
        ...formData,
        base_currency: base || 'BTC',
        quote_currency: quote || 'USDT',
        strategy_id: strategies?.id || '00000000-0000-0000-0000-000000000000'
      };

      if (editingBot) {
        const { error } = await supabase
          .from('automated_bots')
          .update(botData)
          .eq('id', editingBot.id);

        if (error) throw error;
        toast({ title: "Success", description: "Bot updated successfully" });
      } else {
        const { error } = await supabase
          .from('automated_bots')
          .insert([botData]);

        if (error) throw error;
        toast({ title: "Success", description: "Bot created successfully" });
      }

      setIsDialogOpen(false);
      setEditingBot(null);
      resetForm();
      await fetchBots();
    } catch (error) {
      console.error("Error saving bot:", error);
      toast({
        title: "Error",
        description: "Failed to save bot",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;

    try {
      const { error } = await supabase
        .from('automated_bots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Bot deleted successfully" });
      await fetchBots();
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast({
        title: "Error",
        description: "Failed to delete bot",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (bot: AutomatedBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      description: bot.description || "",
      trading_pair: bot.trading_pair,
      risk_level: bot.risk_level,
      min_balance_required: bot.min_balance_required,
      take_profit_percentage: bot.take_profit_percentage || 5,
      stop_loss_percentage: bot.stop_loss_percentage || 3,
      is_active: bot.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      trading_pair: "",
      risk_level: "medium",
      min_balance_required: 1000,
      take_profit_percentage: 5,
      stop_loss_percentage: 3,
      is_active: true
    });
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-foreground text-lg sm:text-xl">Automated Bot Management</CardTitle>
          <CardDescription className="text-sm">Create and manage automated trading bots</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingBot(null); resetForm(); }} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingBot ? 'Edit' : 'Create'} Automated Bot</DialogTitle>
                <DialogDescription>
                  Configure the automated trading bot parameters
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Bot Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="trading_pair">Trading Pair</Label>
                    <Input
                      id="trading_pair"
                      placeholder="BTC/USDT"
                      value={formData.trading_pair}
                      onChange={(e) => setFormData({ ...formData, trading_pair: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="risk_level">Risk Level</Label>
                    <Select
                      value={formData.risk_level}
                      onValueChange={(value) => setFormData({ ...formData, risk_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min_balance">Min Balance</Label>
                    <Input
                      id="min_balance"
                      type="number"
                      value={formData.min_balance_required}
                      onChange={(e) => setFormData({ ...formData, min_balance_required: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="take_profit">Take Profit %</Label>
                    <Input
                      id="take_profit"
                      type="number"
                      step="0.1"
                      value={formData.take_profit_percentage}
                      onChange={(e) => setFormData({ ...formData, take_profit_percentage: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stop_loss">Stop Loss %</Label>
                    <Input
                      id="stop_loss"
                      type="number"
                      step="0.1"
                      value={formData.stop_loss_percentage}
                      onChange={(e) => setFormData({ ...formData, stop_loss_percentage: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingBot ? 'Update' : 'Create'} Bot
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Trading Pair</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Min Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No automated bots found
                  </TableCell>
                </TableRow>
              ) : (
                bots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell className="font-medium">{bot.name}</TableCell>
                    <TableCell>{bot.trading_pair}</TableCell>
                    <TableCell>
                      <Badge variant={bot.risk_level === 'high' ? 'destructive' : 'default'}>
                        {bot.risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell>${bot.min_balance_required.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={bot.is_active ? 'default' : 'secondary'}>
                        {bot.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(bot)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(bot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
