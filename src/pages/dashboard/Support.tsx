import { useAuth } from '@/contexts/AuthContext';
import SupportTickets from '@/components/dashboard/SupportTickets';

const Support = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support</h1>
        <p className="text-muted-foreground">
          Get help and manage your support tickets
        </p>
      </div>
      
      <SupportTickets userId={user?.id} />
    </div>
  );
};

export default Support;