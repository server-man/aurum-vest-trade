import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, LogOut, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Session {
  id: string;
  created_at: string;
  last_activity: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  location?: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
  } | null;
}

const LoginActivity = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchSessions();
      // Create or update current session
      updateCurrentSession();
    }
  }, [user]);

  const updateCurrentSession = async () => {
    if (!user) return;

    try {
      const userAgent = navigator.userAgent;
      const deviceInfo = {
        platform: navigator.platform,
        language: navigator.language,
      };

      // Check if session exists
      const { data: existingSession } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (existingSession) {
        setCurrentSessionId(existingSession.id);
        // Update last activity
        await supabase
          .from('sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', existingSession.id);
      } else {
        // Create new session
        const { data: newSession } = await supabase
          .from('sessions')
          .insert({
            user_id: user.id,
            user_agent: userAgent,
            device_info: deviceInfo,
            session_token: crypto.randomUUID(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true,
          })
          .select()
          .single();

        if (newSession) {
          setCurrentSessionId(newSession.id);
        }
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;

      // Fetch geolocation for each session
      const sessionsWithLocation = await Promise.all(
        (data || []).map(async (session) => {
          if (session.ip_address) {
            try {
              const { data: geoData } = await supabase.functions.invoke('ip-geolocation', {
                body: { ip: session.ip_address }
              });

              return {
                ...session,
                location: geoData?.location || 'Unknown'
              };
            } catch (error) {
              console.error('Error fetching geolocation:', error);
              return { ...session, location: 'Unknown' };
            }
          }
          return { ...session, location: 'Unknown' };
        })
      );

      setSessions(sessionsWithLocation as Session[]);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;
      
      await fetchSessions();
      toast.success('Session terminated successfully');
    } catch (error: any) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  const handleLogoutAllSessions = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('id', currentSessionId);

      if (error) throw error;
      
      await fetchSessions();
      toast.success('All other sessions have been terminated');
    } catch (error: any) {
      console.error('Error terminating sessions:', error);
      toast.error('Failed to terminate sessions');
    }
  };

  const getDeviceName = (userAgent: string) => {
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      return userAgent.includes('Safari') ? 'Safari on iPhone' : 'Chrome on iPhone';
    }
    if (userAgent.includes('Android')) {
      return 'Chrome on Android';
    }
    if (userAgent.includes('Windows')) {
      return 'Chrome on Windows';
    }
    if (userAgent.includes('Mac')) {
      return 'Safari on Mac';
    }
    return 'Unknown Device';
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    
    if (diffInMinutes < 5) return 'Active now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading sessions...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Login Activity</CardTitle>
            <CardDescription>
              Manage your active sessions across all devices
            </CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will end all active sessions except your current one. You'll need to log in again on those devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogoutAllSessions}>
                  Logout All Sessions
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No active sessions</p>
        ) : (
          sessions.map((session) => {
            const deviceName = getDeviceName(session.user_agent || '');
            const isCurrent = session.id === currentSessionId;
            
            return (
              <div key={session.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {deviceName.includes('iPhone') || deviceName.includes('Android') ? (
                      <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    ) : (
                      <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{deviceName}</p>
                        {isCurrent && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{session.location || 'Unknown location'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{getRelativeTime(session.last_activity)}</span>
                        </div>
                        {session.ip_address && (
                          <p className="text-xs">IP: {session.ip_address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLogoutSession(session.id)}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default LoginActivity;
