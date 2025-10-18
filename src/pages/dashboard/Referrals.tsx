import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, Users, DollarSign, TrendingUp, Share2 } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

interface Referral {
  id: string;
  referred_id: string;
  status: string;
  total_commission: number;
  commission_rate: number;
  created_at: string;
  profiles?: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalCommission: 0,
    pendingCommission: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateReferralCode();
      fetchReferrals();
    }
  }, [user]);

  const generateReferralCode = () => {
    if (user) {
      // Generate a unique referral code based on user ID
      const code = `AV-${user.id.substring(0, 8).toUpperCase()}`;
      setReferralCode(code);
    }
  };

  const fetchReferrals = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch referrals where current user is the referrer
      const { data, error } = await supabase
        .from('referrals')
        .select('id, referred_id, status, total_commission, commission_rate, created_at')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Manually fetch profile data for each referral
      const referralsWithProfiles = await Promise.all(
        (data || []).map(async (referral) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, first_name, last_name')
            .eq('id', referral.referred_id)
            .single();

          return {
            ...referral,
            profiles: profileData || { username: '', first_name: '', last_name: '' }
          };
        })
      );

      setReferrals(referralsWithProfiles);

      // Calculate stats
      const totalReferrals = referralsWithProfiles?.length || 0;
      const activeReferrals = referralsWithProfiles?.filter(r => r.status === 'active').length || 0;
      const totalCommission = referralsWithProfiles?.reduce((sum, r) => sum + (r.total_commission || 0), 0) || 0;
      const pendingCommission = referralsWithProfiles?.filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (r.total_commission || 0), 0) || 0;

      setStats({
        totalReferrals,
        activeReferrals,
        totalCommission,
        pendingCommission
      });

    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;
    const shareData = {
      title: 'Join Aurum Vest',
      text: 'Start your crypto trading journey with Aurum Vest! Use my referral link:',
      url: referralLink
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared!",
          description: "Referral link shared successfully",
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyReferralCode();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">
            Earn commission by inviting friends to Aurum Vest
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferrals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeReferrals} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalCommission)}</div>
              <p className="text-xs text-muted-foreground">
                All-time commission
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.pendingCommission)}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5%</div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends to earn commission on their trades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/?ref=${referralCode}`}
                className="font-mono"
              />
              <Button onClick={copyReferralCode} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={shareReferral}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Your referral code: <span className="font-mono font-semibold">{referralCode}</span>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              Track your referred users and earned commissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading referrals...
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No referrals yet</p>
                <p className="text-sm">Start sharing your referral link to earn commissions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <div className="font-semibold">
                        {referral.profiles?.first_name} {referral.profiles?.last_name || 'User'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{referral.profiles?.username || 'anonymous'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Joined {new Date(referral.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                        {referral.status}
                      </Badge>
                      <div className="font-bold mt-2">
                        {formatPrice(referral.total_commission)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(referral.commission_rate * 100).toFixed(1)}% rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Referrals;
