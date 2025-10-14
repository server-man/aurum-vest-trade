import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendNotification, subscribeToPushNotifications, unsubscribeFromPushNotifications, NotificationPayload } from '@/lib/notifications';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchNotifications();
    checkPushSubscription();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          handleNotificationChange(payload);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.is_read).length);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  const checkPushSubscription = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('push_subscriptions')
      .select('is_active')
      .eq('user_id', user.id)
      .single();

    setPushEnabled(data?.is_active || false);
  };

  const handleNotificationChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newNotification = payload.new as Notification;
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast for new notification
      toast.info(newNotification.title, {
        description: newNotification.message,
      });

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/logo.png',
        });
      }
    } else if (payload.eventType === 'UPDATE') {
      setNotifications(prev =>
        prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
      );
    } else if (payload.eventType === 'DELETE') {
      setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to mark as read');
      return false;
    }

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    return true;
  };

  const markAllAsRead = async () => {
    if (!user) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      toast.error('Failed to mark all as read');
      return false;
    }

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success('All notifications marked as read');
    return true;
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete notification');
      return false;
    }

    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
    return true;
  };

  const send = async (payload: Omit<NotificationPayload, 'userId'>) => {
    if (!user) return { success: false };

    return await sendNotification({
      ...payload,
      userId: user.id
    });
  };

  const enablePush = async () => {
    if (!user) return { success: false };

    const result = await subscribeToPushNotifications(user.id);
    if (result.success) {
      setPushEnabled(true);
      toast.success('Push notifications enabled');
    } else {
      toast.error('Failed to enable push notifications');
    }
    return result;
  };

  const disablePush = async () => {
    if (!user) return { success: false };

    const result = await unsubscribeFromPushNotifications(user.id);
    if (result.success) {
      setPushEnabled(false);
      toast.success('Push notifications disabled');
    } else {
      toast.error('Failed to disable push notifications');
    }
    return result;
  };

  return {
    notifications,
    unreadCount,
    loading,
    pushEnabled,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    send,
    enablePush,
    disablePush,
    refresh: fetchNotifications
  };
}
