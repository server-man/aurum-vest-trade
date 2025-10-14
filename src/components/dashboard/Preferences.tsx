import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Globe, DollarSign, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

interface PreferencesData {
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
    security: boolean;
  };
  language: string;
  currency: string;
  theme: string;
}

const DEFAULT_PREFERENCES: PreferencesData = {
  notifications: {
    email: true,
    push: true,
    trading: true,
    security: true,
  },
  language: 'en',
  currency: 'USD',
  theme: 'system',
};

const Preferences = () => {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState<PreferencesData>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Sync theme with the theme context
  useEffect(() => {
    setPreferences(prev => ({ ...prev, theme }));
  }, [theme]);

  const savePreferences = (newPreferences: PreferencesData) => {
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    toast.success('Preferences saved successfully');
  };

  const handleNotificationToggle = (key: keyof PreferencesData['notifications'], value: boolean) => {
    const newPreferences = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    };
    savePreferences(newPreferences);
  };

  const handleLanguageChange = (value: string) => {
    savePreferences({ ...preferences, language: value });
  };

  const handleCurrencyChange = (value: string) => {
    savePreferences({ ...preferences, currency: value });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
    const newPreferences = { ...preferences, theme: value };
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    toast.success('Theme updated successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your experience and notification settings (stored locally)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-3 pl-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trading-notifications">Trading Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about trading activities</p>
              </div>
              <Switch
                id="trading-notifications"
                checked={preferences.notifications.trading}
                onCheckedChange={(checked) => handleNotificationToggle('trading', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="security-notifications">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Important security notifications</p>
              </div>
              <Switch
                id="security-notifications"
                checked={preferences.notifications.security}
                onCheckedChange={(checked) => handleNotificationToggle('security', checked)}
              />
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Language</h3>
          </div>
          
          <div className="pl-7">
            <Select value={preferences.language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Currency</h3>
          </div>
          
          <div className="pl-7">
            <Select value={preferences.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Theme</h3>
          </div>
          
          <div className="pl-7">
            <Select value={preferences.theme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preferences;
