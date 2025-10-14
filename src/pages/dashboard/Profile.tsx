import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UserProfile from '@/components/dashboard/UserProfile';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information
        </p>
      </div>
      
      <UserProfile 
        user={user} 
        profile={userProfile} 
        onProfileUpdate={setUserProfile} 
      />
    </div>
  );
};

export default Profile;