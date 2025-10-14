import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock, Smartphone, Key, Shield, Eye, EyeOff, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SecuritySettings {
  pin_enabled: boolean;
  two_factor_enabled: boolean;
  passkey_enabled: boolean;
}

const SecuritySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFASecret, setTwoFASecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [passkeyDialogOpen, setPasskeyDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSecuritySettings();
    }
  }, [user]);

  const fetchSecuritySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('pin_enabled, two_factor_enabled, passkey_enabled')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const { data: newSettings } = await supabase
          .from('security_settings')
          .insert({
            user_id: user.id,
            pin_enabled: false,
            two_factor_enabled: false,
            passkey_enabled: false,
          })
          .select('pin_enabled, two_factor_enabled, passkey_enabled')
          .single();
        
        setSettings(newSettings);
      }
    } catch (error: any) {
      console.error('Error fetching security settings:', error);
      toast.error('Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPin = async () => {
    if (!user) return;

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      toast.error('PIN must be 4 digits');
      return;
    }
    
    if (pin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    try {
      // Call edge function to hash PIN with bcrypt
      const { data, error } = await supabase.functions.invoke('security-pin', {
        body: { action: 'set', pin }
      });

      if (error) throw error;

      if (data?.success) {
        await fetchSecuritySettings();
        setDialogOpen(false);
        setPin('');
        setConfirmPin('');
        toast.success('PIN setup successfully with bcrypt encryption');
      } else {
        throw new Error(data?.message || 'Failed to setup PIN');
      }
    } catch (error: any) {
      console.error('Error setting up PIN:', error);
      toast.error('Failed to setup PIN');
    }
  };

  const handleSetup2FA = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'setup' }
      });

      if (error) throw error;

      if (data?.success) {
        setQrCodeUrl(data.qrCodeUrl);
        setTwoFASecret(data.secret);
        setTwoFADialogOpen(true);
      } else {
        throw new Error('Failed to setup 2FA');
      }
    } catch (error: any) {
      console.error('Error setting up 2FA:', error);
      toast.error('Failed to setup 2FA');
    }
  };

  const handleVerify2FA = async () => {
    if (!user || !verificationCode) return;

    try {
      const { data, error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'verify', token: verificationCode }
      });

      if (error) throw error;

      if (data?.success) {
        await fetchSecuritySettings();
        setTwoFADialogOpen(false);
        setVerificationCode('');
        toast.success('2FA enabled successfully with authenticator app');
      } else {
        toast.error(data?.message || 'Invalid verification code');
      }
    } catch (error: any) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify 2FA code');
    }
  };

  const handleDisable2FA = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('security_settings')
        .update({ 
          two_factor_enabled: false,
          two_factor_secret: null,
          two_factor_method: null 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSecuritySettings();
      toast.success('2FA disabled');
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
    }
  };

  const handleSetupPasskey = async () => {
    if (!user) return;

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        toast.error('WebAuthn is not supported in this browser');
        return;
      }

      // Create WebAuthn credential
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "Trading Platform",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(user.id),
          name: user.email || 'user',
          displayName: user.email || 'User',
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      // Store credential in database
      const { data, error } = await supabase.functions.invoke('webauthn-passkey', {
        body: { 
          action: 'register',
          credentialId: credential.id,
          publicKey: btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        }
      });

      if (error) throw error;

      if (data?.success) {
        await fetchSecuritySettings();
        setPasskeyDialogOpen(false);
        toast.success('Passkey registered successfully with WebAuthn');
      } else {
        throw new Error('Failed to register passkey');
      }
    } catch (error: any) {
      console.error('Error setting up passkey:', error);
      toast.error(error.message || 'Failed to setup passkey');
    }
  };

  const handleRemovePasskey = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('webauthn-passkey', {
        body: { action: 'remove' }
      });

      if (error) throw error;

      if (data?.success) {
        await fetchSecuritySettings();
        toast.success('Passkey removed');
      }
    } catch (error: any) {
      console.error('Error removing passkey:', error);
      toast.error('Failed to remove passkey');
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading security settings...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Enhance your account security with additional authentication methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PIN Setup */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Security PIN</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.pin_enabled ? 'PIN is active' : 'Set up a 4-digit PIN for additional security'}
                </p>
              </div>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={settings?.pin_enabled ? "outline" : "default"} size="sm">
                {settings?.pin_enabled ? 'Change PIN' : 'Setup PIN'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Setup Security PIN</DialogTitle>
                <DialogDescription>
                  Create a 4-digit PIN for additional security
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN (4 digits)</Label>
                  <div className="relative">
                    <Input
                      id="pin"
                      type={showPin ? "text" : "password"}
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit PIN"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPin">Confirm PIN</Label>
                  <Input
                    id="confirmPin"
                    type={showPin ? "text" : "password"}
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Confirm 4-digit PIN"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSetupPin}>
                  {settings?.pin_enabled ? 'Update PIN' : 'Create PIN'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 2FA Setup */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.two_factor_enabled ? 'Authenticator app is active' : 'Use an authenticator app for extra security'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!settings?.two_factor_enabled ? (
              <Button onClick={handleSetup2FA} size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Setup Authenticator
              </Button>
            ) : (
              <Button onClick={handleDisable2FA} variant="outline" size="sm">
                Disable 2FA
              </Button>
            )}
          </div>
        </div>

        <Dialog open={twoFADialogOpen} onOpenChange={setTwoFADialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                    alt="2FA QR Code"
                    className="border border-border rounded-lg"
                  />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Or enter this code manually:</p>
                    <code className="bg-muted px-3 py-1 rounded text-sm">{twoFASecret}</code>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Enter verification code from your app</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleVerify2FA} disabled={verificationCode.length !== 6}>
                Verify and Enable
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Passkey Setup */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Passkey (WebAuthn)</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.passkey_enabled ? 'Biometric authentication is active' : 'Use fingerprint, face, or device PIN for secure login'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!settings?.passkey_enabled ? (
              <Dialog open={passkeyDialogOpen} onOpenChange={setPasskeyDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Setup Passkey
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Setup Passkey</DialogTitle>
                    <DialogDescription>
                      Use your device's biometric authentication (fingerprint, face recognition) or device PIN for secure login
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      When you click "Setup Passkey", your device will prompt you to use your biometric authentication or device PIN.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This creates a secure passkey that's stored on your device and cannot be used on other devices.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSetupPasskey}>
                      Setup Passkey
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button onClick={handleRemovePasskey} variant="outline" size="sm">
                Remove Passkey
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
