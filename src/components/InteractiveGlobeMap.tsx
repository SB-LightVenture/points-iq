
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plane, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

// Mapbox public token - using a public token for demo purposes
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwidmVyc2lvbiI6MX0.Y8u3KaVzf4_4HzEkrJBF8Q';

type Airport = Tables<'airports'>;
type PopularDestination = Tables<'popular_destinations'> & {
  origin_airport: Airport;
  destination_airport: Airport;
};

interface InteractiveGlobeMapProps {
  onDestinationSelect?: (airport: Airport) => void;
}

const InteractiveGlobeMap: React.FC<InteractiveGlobeMapProps> = ({ onDestinationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [homeAirports, setHomeAirports] = useState<Airport[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<PopularDestination[]>([]);
  const [selectedHomeAirport, setSelectedHomeAirport] = useState<Airport | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40],
      zoom: 2,
      projection: 'globe' as any
    });

    map.current.on('style.load', () => {
      if (map.current) {
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Load airports data
  useEffect(() => {
    const loadAirports = async () => {
      const { data: airportsData, error } = await supabase
        .from('airports')
        .select('*')
        .eq('is_major', true);

      if (error) {
        console.error('Error loading airports:', error);
        return;
      }

      setAirports(airportsData || []);
    };

    loadAirports();
  }, []);

  // Load user's home airports
  useEffect(() => {
    if (!user) return;

    const loadHomeAirports = async () => {
      const { data, error } = await supabase
        .from('user_home_airports')
        .select(`
          *,
          airports (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading home airports:', error);
        return;
      }

      const homeAirportsList = data?.map(item => item.airports).filter(Boolean) as Airport[] || [];
      setHomeAirports(homeAirportsList);
      
      // Set primary home airport if exists
      const primaryHome = data?.find(item => item.is_primary);
      if (primaryHome && primaryHome.airports) {
        setSelectedHomeAirport(primaryHome.airports as Airport);
      } else if (homeAirportsList.length > 0) {
        setSelectedHomeAirport(homeAirportsList[0]);
      }
    };

    loadHomeAirports();
  }, [user]);

  // Add airport markers to map
  useEffect(() => {
    if (!map.current || airports.length === 0) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.airport-marker');
    existingMarkers.forEach(marker => marker.remove());

    airports.forEach(airport => {
      const markerElement = document.createElement('div');
      markerElement.className = 'airport-marker';
      markerElement.innerHTML = `
        <div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-blue-400 transition-colors"></div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([airport.longitude, airport.latitude])
        .addTo(map.current!);

      // Add popup on click
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${airport.name}</h3>
            <p class="text-xs text-gray-600">${airport.city}, ${airport.country}</p>
            <p class="text-xs font-mono">${airport.iata_code}</p>
            <button 
              class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              onclick="window.selectDestination?.('${airport.id}')"
            >
              Select Destination
            </button>
          </div>
        `);

      markerElement.addEventListener('click', () => {
        popup.addTo(map.current!);
      });
    });

    // Global function for destination selection
    (window as any).selectDestination = (airportId: string) => {
      const airport = airports.find(a => a.id === airportId);
      if (airport && onDestinationSelect) {
        onDestinationSelect(airport);
        toast({
          title: "Destination Selected",
          description: `${airport.name} (${airport.iata_code}) selected for flight search.`,
        });
      }
    };

    return () => {
      delete (window as any).selectDestination;
    };
  }, [airports, onDestinationSelect, toast]);

  // Add flight routes from selected home airport
  useEffect(() => {
    if (!map.current || !selectedHomeAirport) return;

    // Remove existing route layers
    if (map.current.getSource('routes')) {
      map.current.removeLayer('routes');
      map.current.removeSource('routes');
    }

    // Create routes from home airport to popular destinations
    const routeFeatures = airports
      .filter(airport => airport.id !== selectedHomeAirport.id)
      .slice(0, 10) // Show top 10 destinations
      .map(destination => ({
        type: 'Feature' as const,
        properties: {
          origin: selectedHomeAirport.iata_code,
          destination: destination.iata_code,
          cost: Math.floor(Math.random() * 100000) + 25000 // Mock points cost
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [selectedHomeAirport.longitude, selectedHomeAirport.latitude],
            [destination.longitude, destination.latitude]
          ]
        }
      }));

    map.current.addSource('routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: routeFeatures
      }
    });

    map.current.addLayer({
      id: 'routes',
      type: 'line',
      source: 'routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', 'cost'],
          25000, '#22c55e', // Green for cheaper flights
          50000, '#eab308', // Yellow for medium cost
          75000, '#ef4444'  // Red for expensive flights
        ],
        'line-width': 2,
        'line-opacity': 0.8
      }
    });

    // Center map on home airport
    map.current.flyTo({
      center: [selectedHomeAirport.longitude, selectedHomeAirport.latitude],
      zoom: 3,
      duration: 2000
    });

  }, [selectedHomeAirport, airports]);

  const setAsHomeAirport = async (airport: Airport) => {
    if (!user) return;

    try {
      // Remove existing primary home airport
      await supabase
        .from('user_home_airports')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Add new home airport
      const { error } = await supabase
        .from('user_home_airports')
        .upsert({
          user_id: user.id,
          airport_id: airport.id,
          is_primary: true
        });

      if (error) throw error;

      setSelectedHomeAirport(airport);
      toast({
        title: "Home Airport Set",
        description: `${airport.name} is now your primary home airport.`,
      });
    } catch (error) {
      console.error('Error setting home airport:', error);
      toast({
        title: "Error",
        description: "Failed to set home airport. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-slate-700">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Controls overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Home Airport</span>
          </div>
          {selectedHomeAirport ? (
            <div className="text-xs text-gray-300">
              <div className="font-medium">{selectedHomeAirport.iata_code}</div>
              <div>{selectedHomeAirport.city}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">
              Click an airport to set as home
            </div>
          )}
        </div>

        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <Plane className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Routes</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-300">25k-50k pts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-yellow-500"></div>
              <span className="text-gray-300">50k-75k pts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-gray-300">75k+ pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">How to Use</span>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>• Click airports to view details</div>
          <div>• Select destinations for flight search</div>
          <div>• Routes show from your home airport</div>
          <div>• Colors indicate point costs</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobeMap;
