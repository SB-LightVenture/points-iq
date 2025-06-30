
-- Create airports table with major airport data
CREATE TABLE public.airports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  iata_code VARCHAR(3) NOT NULL UNIQUE,
  icao_code VARCHAR(4),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_major BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create popular destinations table
CREATE TABLE public.popular_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin_airport_id UUID REFERENCES public.airports(id) NOT NULL,
  destination_airport_id UUID REFERENCES public.airports(id) NOT NULL,
  search_count INTEGER NOT NULL DEFAULT 0,
  avg_points_cost INTEGER,
  last_searched_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(origin_airport_id, destination_airport_id)
);

-- Create user home airports table
CREATE TABLE public.user_home_airports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  airport_id UUID REFERENCES public.airports(id) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, airport_id)
);

-- Add Row Level Security
ALTER TABLE public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_home_airports ENABLE ROW LEVEL SECURITY;

-- Airports policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view airports" 
  ON public.airports 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Popular destinations policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view popular destinations" 
  ON public.popular_destinations 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- User home airports policies
CREATE POLICY "Users can view their own home airports" 
  ON public.user_home_airports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own home airports" 
  ON public.user_home_airports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own home airports" 
  ON public.user_home_airports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own home airports" 
  ON public.user_home_airports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert major airports data
INSERT INTO public.airports (iata_code, icao_code, name, city, country, latitude, longitude, is_major) VALUES
('LAX', 'KLAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', 33.9425, -118.4081, true),
('JFK', 'KJFK', 'John F. Kennedy International Airport', 'New York', 'United States', 40.6413, -73.7781, true),
('LHR', 'EGLL', 'London Heathrow Airport', 'London', 'United Kingdom', 51.4700, -0.4543, true),
('NRT', 'RJAA', 'Narita International Airport', 'Tokyo', 'Japan', 35.7720, 140.3929, true),
('CDG', 'LFPG', 'Charles de Gaulle Airport', 'Paris', 'France', 49.0097, 2.5479, true),
('DXB', 'OMDB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates', 25.2532, 55.3657, true),
('SIN', 'WSSS', 'Singapore Changi Airport', 'Singapore', 'Singapore', 1.3644, 103.9915, true),
('HKG', 'VHHH', 'Hong Kong International Airport', 'Hong Kong', 'Hong Kong', 22.3080, 113.9185, true),
('SYD', 'YSSY', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia', -33.9399, 151.1753, true),
('FRA', 'EDDF', 'Frankfurt Airport', 'Frankfurt', 'Germany', 50.0379, 8.5622, true),
('ORD', 'KORD', 'Chicago OHare International Airport', 'Chicago', 'United States', 41.9742, -87.9073, true),
('DFW', 'KDFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'United States', 32.8998, -97.0403, true),
('ATL', 'KATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States', 33.6407, -84.4277, true),
('MIA', 'KMIA', 'Miami International Airport', 'Miami', 'United States', 25.7959, -80.2870, true),
('SEA', 'KSEA', 'Seattle-Tacoma International Airport', 'Seattle', 'United States', 47.4502, -122.3088, true),
('SFO', 'KSFO', 'San Francisco International Airport', 'San Francisco', 'United States', 37.6213, -122.3790, true),
('BOS', 'KBOS', 'Logan International Airport', 'Boston', 'United States', 42.3656, -71.0096, true),
('IAD', 'KIAD', 'Washington Dulles International Airport', 'Washington D.C.', 'United States', 38.9531, -77.4565, true),
('YVR', 'CYVR', 'Vancouver International Airport', 'Vancouver', 'Canada', 49.1967, -123.1815, true),
('YYZ', 'CYYZ', 'Toronto Pearson International Airport', 'Toronto', 'Canada', 43.6777, -79.6248, true);

-- Create indexes for better performance
CREATE INDEX idx_airports_iata ON public.airports(iata_code);
CREATE INDEX idx_airports_major ON public.airports(is_major) WHERE is_major = true;
CREATE INDEX idx_popular_destinations_origin ON public.popular_destinations(origin_airport_id);
CREATE INDEX idx_user_home_airports_user ON public.user_home_airports(user_id);
CREATE INDEX idx_user_home_airports_primary ON public.user_home_airports(user_id, is_primary) WHERE is_primary = true;
