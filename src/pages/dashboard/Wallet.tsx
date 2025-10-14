import { useAuth } from '@/contexts/AuthContext';
import WalletOverview from '@/components/dashboard/WalletOverview';

const Wallet = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your cryptocurrency assets and transactions
        </p>
      </div>
      
      <WalletOverview userId={user?.id} />
    </div>
  );
};

export default Wallet;