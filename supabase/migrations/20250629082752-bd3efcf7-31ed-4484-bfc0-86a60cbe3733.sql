
-- Remove the single active wallet enforcement trigger
DROP TRIGGER IF EXISTS ensure_single_active_wallet_trigger ON public.points_wallets;

-- Drop the function as well since it's no longer needed
DROP FUNCTION IF EXISTS public.ensure_single_active_wallet();

-- Update the is_active field to be more of a "preferred" indicator rather than enforced single active
-- Keep the field for potential future use but remove the enforcement
COMMENT ON COLUMN public.points_wallets.is_active IS 'Indicates user preference for default wallet display, not enforced as single active';
