
-- Create flight_searches table to store search history and cache results
CREATE TABLE public.flight_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  origin_airport VARCHAR(3) NOT NULL,
  destination_airport VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  cabin_class VARCHAR(20) NOT NULL DEFAULT 'economy',
  passengers INTEGER NOT NULL DEFAULT 1,
  search_parameters JSONB NOT NULL,
  api_response JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flight_routes table for popular route optimization
CREATE TABLE public.flight_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin_airport VARCHAR(3) NOT NULL,
  destination_airport VARCHAR(3) NOT NULL,
  route_name TEXT NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  search_count INTEGER NOT NULL DEFAULT 0,
  last_searched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(origin_airport, destination_airport)
);

-- Create airlines table for mapping airline codes to programs
CREATE TABLE public.airlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  iata_code VARCHAR(2) NOT NULL UNIQUE,
  icao_code VARCHAR(3),
  name TEXT NOT NULL,
  frequent_flyer_program_id UUID REFERENCES public.frequent_flyer_programs(id),
  alliance VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.flight_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airlines ENABLE ROW LEVEL SECURITY;

-- Flight searches policies (users can only see their own searches)
CREATE POLICY "Users can view their own flight searches" 
  ON public.flight_searches 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flight searches" 
  ON public.flight_searches 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flight searches" 
  ON public.flight_searches 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flight searches" 
  ON public.flight_searches 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Flight routes policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view flight routes" 
  ON public.flight_routes 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Airlines policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view airlines" 
  ON public.airlines 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Insert some initial airline data
INSERT INTO public.airlines (iata_code, icao_code, name, alliance) VALUES
('AA', 'AAL', 'American Airlines', 'oneworld'),
('UA', 'UAL', 'United Airlines', 'Star Alliance'),
('DL', 'DAL', 'Delta Air Lines', 'SkyTeam'),
('AS', 'ASA', 'Alaska Airlines', 'oneworld'),
('B6', 'JBU', 'JetBlue Airways', NULL),
('WN', 'SWA', 'Southwest Airlines', NULL),
('F9', 'FFT', 'Frontier Airlines', NULL),
('NK', 'NKS', 'Spirit Airlines', NULL);

-- Create indexes for better performance
CREATE INDEX idx_flight_searches_user_id ON public.flight_searches(user_id);
CREATE INDEX idx_flight_searches_route ON public.flight_searches(origin_airport, destination_airport);
CREATE INDEX idx_flight_searches_date ON public.flight_searches(departure_date);
CREATE INDEX idx_flight_routes_popular ON public.flight_routes(is_popular) WHERE is_popular = true;
