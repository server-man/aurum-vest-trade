-- Update RLS policies for admin management

-- ============================================
-- AUTOMATED BOTS (Admin can create/manage, users can only view active ones)
-- ============================================

-- Drop existing policies and create new ones
DROP POLICY IF EXISTS "Automated bots are viewable by authenticated users" ON automated_bots;

-- Admins can manage all automated bots
CREATE POLICY "Admins can manage all automated bots"
ON automated_bots
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active automated bots
CREATE POLICY "Users can view active automated bots"
ON automated_bots
FOR SELECT
USING (auth.uid() IS NOT NULL AND is_active = true);

-- ============================================
-- SIGNALS (Admin can create/manage, users can only view active ones)
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins and sub admins can manage signals" ON signals;
DROP POLICY IF EXISTS "Authenticated users can view active signals" ON signals;

-- Admins can manage all signals
CREATE POLICY "Admins can manage all signals"
ON signals
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active signals
CREATE POLICY "Users can view active signals"
ON signals
FOR SELECT
USING (auth.uid() IS NOT NULL AND is_active = true);

-- ============================================
-- KYC VERIFICATIONS (Already has proper policies, just ensure consistency)
-- ============================================
-- Existing policies are good:
-- - Users can view/update their own
-- - Admins can view/update all

-- ============================================
-- TRADING BOTS (Users create from automated_bots, not directly)
-- ============================================
-- Existing policies are good:
-- - Users can CRUD their own bots
-- This is correct as users activate automated bots by creating a trading_bot instance