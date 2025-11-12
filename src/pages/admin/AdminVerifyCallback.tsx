import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminVerifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Get the session after OAuth
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Authentication failed');
      }

      // Verify admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleError || !roleData || roleData.role !== 'admin') {
        toast.error('Access denied. Admin role required.');
        navigate('/dashboard');
        return;
      }

      // Create verification session via edge function
      const { data, error } = await supabase.functions.invoke('admin-verification', {
        body: {
          verificationType: 'oauth',
          provider: 'github',
        },
      });

      if (error || !data?.success) {
        throw new Error('Failed to create admin session');
      }

      toast.success('GitHub verification successful!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
      navigate('/admin/verify');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Verifying authentication...</p>
      </div>
    </div>
  );
};

export default AdminVerifyCallback;
