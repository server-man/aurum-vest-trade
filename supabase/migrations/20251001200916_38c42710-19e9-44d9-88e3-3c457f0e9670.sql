-- Create KYC verifications table
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id')),
  document_front_url TEXT,
  document_back_url TEXT,
  selfie_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on kyc_verifications
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own KYC verification
CREATE POLICY "Users can view their own KYC verification"
  ON public.kyc_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own KYC verification
CREATE POLICY "Users can insert their own KYC verification"
  ON public.kyc_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own KYC verification
CREATE POLICY "Users can update their own KYC verification"
  ON public.kyc_verifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all KYC verifications
CREATE POLICY "Admins can view all KYC verifications"
  ON public.kyc_verifications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all KYC verifications
CREATE POLICY "Admins can update all KYC verifications"
  ON public.kyc_verifications
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create security_settings table
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT,
  pin_enabled BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method TEXT CHECK (two_factor_method IN ('sms', 'email', 'authenticator')),
  two_factor_secret TEXT,
  passkey_enabled BOOLEAN DEFAULT false,
  passkey_credential_id TEXT,
  passkey_public_key TEXT,
  backup_codes TEXT[],
  last_pin_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on security_settings
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their own security settings
CREATE POLICY "Users can view their own security settings"
  ON public.security_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own security settings
CREATE POLICY "Users can insert their own security settings"
  ON public.security_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own security settings
CREATE POLICY "Users can update their own security settings"
  ON public.security_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on kyc_verifications
CREATE TRIGGER update_kyc_verifications_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on security_settings
CREATE TRIGGER update_security_settings_updated_at
  BEFORE UPDATE ON public.security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_kyc_verifications_user_id ON public.kyc_verifications(user_id);
CREATE INDEX idx_kyc_verifications_status ON public.kyc_verifications(verification_status);
CREATE INDEX idx_security_settings_user_id ON public.security_settings(user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_is_active ON public.sessions(is_active);