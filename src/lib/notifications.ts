import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'signal' | 'trade' | 'kyc';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  sendPush?: boolean;
}

/**
 * Send notification to user (in-app and optionally push)
 */
export async function sendNotification(payload: NotificationPayload) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        user_id: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        link: payload.link,
        send_push: payload.sendPush || false
      }
    });

    if (error) {
      console.error('Error sending notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { success: false, error };
  }
}

/**
 * Request push notification permission
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support push notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(userId: string) {
  try {
    const hasPermission = await requestPushPermission();
    if (!hasPermission) {
      return { success: false, error: 'Push notification permission denied' };
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      return { success: false, error: 'Service workers not supported' };
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });

    // Store subscription in database
    const subscriptionJson = subscription.toJSON();
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription_data: subscriptionJson as any,
        is_active: true
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error storing push subscription:', error);
      return { success: false, error };
    }

    return { success: true, subscription };
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return { success: false, error };
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(userId: string) {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }
    }

    // Deactivate subscription in database
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) {
      console.error('Error unsubscribing from push:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return { success: false, error };
  }
}

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Show browser notification
 */
export function showBrowserNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      ...options
    });
  }
}
