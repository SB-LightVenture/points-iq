
-- Create a table for early access email signups
CREATE TABLE public.early_access_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert their email (public signup)
CREATE POLICY "Anyone can sign up for early access" 
  ON public.early_access_signups 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that prevents public reading of emails (privacy)
CREATE POLICY "Only authenticated users can view signups" 
  ON public.early_access_signups 
  FOR SELECT 
  USING (false);
