
-- Create frequent flyer programs reference table
CREATE TABLE public.frequent_flyer_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  partner_programs TEXT[], -- Array of partner program codes
  status_levels TEXT[] NOT NULL DEFAULT ARRAY['Bronze', 'Silver', 'Gold', 'Platinum'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create points wallets table
CREATE TABLE public.points_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES public.frequent_flyer_programs(id) ON DELETE CASCADE NOT NULL,
  points_balance INTEGER NOT NULL DEFAULT 0,
  status_level TEXT NOT NULL DEFAULT 'Bronze',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.frequent_flyer_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_wallets ENABLE ROW LEVEL SECURITY;

-- RLS policies for frequent_flyer_programs (read-only for all authenticated users)
CREATE POLICY "Anyone can view frequent flyer programs"
  ON public.frequent_flyer_programs
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS policies for points_wallets (users can only access their own wallets)
CREATE POLICY "Users can view their own wallets"
  ON public.points_wallets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallets"
  ON public.points_wallets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets"
  ON public.points_wallets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets"
  ON public.points_wallets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Insert some popular frequent flyer programs
INSERT INTO public.frequent_flyer_programs (name, code, partner_programs, status_levels) VALUES
('Qantas Frequent Flyer', 'QF', ARRAY['AA', 'BA', 'CX', 'JL'], ARRAY['Bronze', 'Silver', 'Gold', 'Platinum', 'Platinum One']),
('Virgin Velocity', 'VA', ARRAY['DL', 'SQ', 'EY'], ARRAY['Red', 'Silver', 'Gold', 'Platinum']),
('Emirates Skywards', 'EK', ARRAY['QF', 'JL'], ARRAY['Blue', 'Silver', 'Gold', 'Platinum']),
('Singapore Airlines KrisFlyer', 'SQ', ARRAY['UA', 'LH', 'AC'], ARRAY['KrisFlyer', 'Elite Silver', 'Elite Gold', 'PPS Club']),
('American Airlines AAdvantage', 'AA', ARRAY['QF', 'BA', 'CX'], ARRAY['Gold', 'Platinum', 'Platinum Pro', 'Executive Platinum']),
('British Airways Executive Club', 'BA', ARRAY['QF', 'AA', 'IB'], ARRAY['Blue', 'Bronze', 'Silver', 'Gold']),
('Cathay Pacific Asia Miles', 'CX', ARRAY['AA', 'BA', 'QF'], ARRAY['Green', 'Silver', 'Gold', 'Diamond']);

-- Create function to ensure only one active wallet per user
CREATE OR REPLACE FUNCTION public.ensure_single_active_wallet()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If setting a wallet to active, deactivate all other wallets for this user
  IF NEW.is_active = true THEN
    UPDATE public.points_wallets 
    SET is_active = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to ensure only one active wallet per user
CREATE TRIGGER ensure_single_active_wallet_trigger
  BEFORE INSERT OR UPDATE ON public.points_wallets
  FOR EACH ROW EXECUTE FUNCTION public.ensure_single_active_wallet();
