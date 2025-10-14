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
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

interface Signal {
  id: string;
  symbol: string;
  signal_type: string;
  price: number;
  target_price?: number;
  stop_loss?: number;
  confidence_level?: number;
  description?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export function AdminSignalsManagement() {
  const { user } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
  const [formData, setFormData] = useState({
    symbol: "",
    signal_type: "buy",
    price: 0,
    target_price: 0,
    stop_loss: 0,
    confidence_level: 75,
    description: "",
    is_active: true,
    expires_at: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignals(data || []);
    } catch (error) {
      console.error("Error fetching signals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch signals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const signalData = {
        ...formData,
        created_by: user?.id,
        source: 'admin'
      };

      if (editingSignal) {
        const { error } = await supabase
          .from('signals')
          .update(signalData)
          .eq('id', editingSignal.id);

        if (error) throw error;
        toast({ title: "Success", description: "Signal updated successfully" });
      } else {
        const { error } = await supabase
          .from('signals')
          .insert([signalData]);

        if (error) throw error;
        toast({ title: "Success", description: "Signal created successfully" });
      }

      setIsDialogOpen(false);
      setEditingSignal(null);
      resetForm();
      await fetchSignals();
    } catch (error) {
      console.error("Error saving signal:", error);
      toast({
        title: "Error",
        description: "Failed to save signal",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this signal?")) return;

    try {
      const { error } = await supabase
        .from('signals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Signal deleted successfully" });
      await fetchSignals();
    } catch (error) {
      console.error("Error deleting signal:", error);
      toast({
        title: "Error",
        description: "Failed to delete signal",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (signal: Signal) => {
    setEditingSignal(signal);
    setFormData({
      symbol: signal.symbol,
      signal_type: signal.signal_type,
      price: signal.price,
      target_price: signal.target_price || 0,
      stop_loss: signal.stop_loss || 0,
      confidence_level: signal.confidence_level || 75,
      description: signal.description || "",
      is_active: signal.is_active,
      expires_at: signal.expires_at ? new Date(signal.expires_at).toISOString().slice(0, 16) : ""
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      symbol: "",
      signal_type: "buy",
      price: 0,
      target_price: 0,
      stop_loss: 0,
      confidence_level: 75,
      description: "",
      is_active: true,
      expires_at: ""
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
          <CardTitle className="text-foreground text-lg sm:text-xl">Trading Signals Management</CardTitle>
          <CardDescription className="text-sm">Create and manage trading signals for users</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingSignal(null); resetForm(); }} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Signal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingSignal ? 'Edit' : 'Create'} Trading Signal</DialogTitle>
                <DialogDescription>
                  Configure the trading signal parameters
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="BTC/USDT"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signal_type">Signal Type</Label>
                    <Select
                      value={formData.signal_type}
                      onValueChange={(value) => setFormData({ ...formData, signal_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="hold">Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Current Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target_price">Target Price</Label>
                    <Input
                      id="target_price"
                      type="number"
                      step="0.01"
                      value={formData.target_price}
                      onChange={(e) => setFormData({ ...formData, target_price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stop_loss">Stop Loss</Label>
                    <Input
                      id="stop_loss"
                      type="number"
                      step="0.01"
                      value={formData.stop_loss}
                      onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="confidence">Confidence Level (%)</Label>
                    <Input
                      id="confidence"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.confidence_level}
                      onChange={(e) => setFormData({ ...formData, confidence_level: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expires_at">Expires At</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about this signal..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingSignal ? 'Update' : 'Create'} Signal
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
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No trading signals found
                  </TableCell>
                </TableRow>
              ) : (
                signals.map((signal) => (
                  <TableRow key={signal.id}>
                    <TableCell className="font-medium">{signal.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={signal.signal_type === 'buy' ? 'default' : 'destructive'}>
                        {signal.signal_type === 'buy' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {signal.signal_type}
                      </Badge>
                    </TableCell>
                    <TableCell>${signal.price.toLocaleString()}</TableCell>
                    <TableCell>${signal.target_price?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{signal.confidence_level}%</TableCell>
                    <TableCell>
                      <Badge variant={signal.is_active ? 'default' : 'secondary'}>
                        {signal.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(signal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(signal.id)}
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
