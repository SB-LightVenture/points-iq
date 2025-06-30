
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plane, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

// Using Mapbox public demo token - in production, this should come from environment
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwidmVyc2lvbiI6MX0.Y8u3KaVzf4_4HzEkrJBF8Q';

type Airport = Tables<'airports'>;

interface InteractiveGlobeMapProps {
  onDestinationSelect?: (airport: Airport) => void;
  homeAirport?: Airport | null;
  onHomeAirportChange?: (airport: Airport) => void;
}

const InteractiveGlobeMap: React.FC<InteractiveGlobeMapProps> = ({ 
  onDestinationSelect, 
  homeAirport,
  onHomeAirportChange 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: homeAirport ? [homeAirport.longitude, homeAirport.latitude] : [-74.5, 40],
      zoom: homeAirport ? 4 : 2,
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

  // Update map center when home airport changes
  useEffect(() => {
    if (map.current && homeAirport) {
      map.current.flyTo({
        center: [homeAirport.longitude, homeAirport.latitude],
        zoom: 4,
        duration: 2000
      });
    }
  }, [homeAirport]);

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

  // Add airport markers to map
  useEffect(() => {
    if (!map.current || airports.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    airports.forEach(airport => {
      const isHome = homeAirport?.id === airport.id;
      
      const markerElement = document.createElement('div');
      markerElement.className = `cursor-pointer transition-all duration-200 ${
        isHome 
          ? 'w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg hover:bg-green-400' 
          : 'w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-400 hover:w-4 hover:h-4'
      }`;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([airport.longitude, airport.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-sm text-white mb-1">${airport.name}</h3>
          <p class="text-xs text-gray-300 mb-2">${airport.city}, ${airport.country}</p>
          <p class="text-xs font-mono text-blue-400 mb-3">${airport.iata_code}</p>
          <div class="flex gap-2">
            ${!isHome ? `
              <button 
                class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                onclick="window.setHomeAirport?.('${airport.id}')"
              >
                Set Home
              </button>
            ` : `
              <span class="px-2 py-1 bg-green-800 text-green-200 text-xs rounded">
                Home Airport
              </span>
            `}
            <button 
              class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              onclick="window.selectDestination?.('${airport.id}')"
            >
              Select Route
            </button>
          </div>
        </div>
      `);

      markerElement.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      markerElement.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });

    // Global functions for airport selection
    (window as any).selectDestination = (airportId: string) => {
      const airport = airports.find(a => a.id === airportId);
      if (airport && onDestinationSelect) {
        onDestinationSelect(airport);
        toast({
          title: "Route Selected",
          description: `${airport.name} (${airport.iata_code}) selected.`,
        });
      }
    };

    (window as any).setHomeAirport = (airportId: string) => {
      const airport = airports.find(a => a.id === airportId);
      if (airport && onHomeAirportChange) {
        onHomeAirportChange(airport);
      }
    };

    return () => {
      delete (window as any).selectDestination;
      delete (window as any).setHomeAirport;
    };
  }, [airports, homeAirport, onDestinationSelect, onHomeAirportChange, toast]);

  // Add flight routes from home airport
  useEffect(() => {
    if (!map.current || !homeAirport) return;

    // Remove existing route layers
    if (map.current.getSource('routes')) {
      map.current.removeLayer('routes');
      map.current.removeSource('routes');
    }

    // Create routes from home airport to other destinations
    const routeFeatures = airports
      .filter(airport => airport.id !== homeAirport.id)
      .slice(0, 12) // Show top 12 destinations
      .map(destination => ({
        type: 'Feature' as const,
        properties: {
          origin: homeAirport.iata_code,
          destination: destination.iata_code,
          cost: Math.floor(Math.random() * 75000) + 25000 // Mock points cost
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [homeAirport.longitude, homeAirport.latitude],
            [destination.longitude, destination.latitude]
          ]
        }
      }));

    if (routeFeatures.length > 0) {
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
          'line-opacity': 0.6
        }
      });
    }
  }, [homeAirport, airports]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Controls overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Home Airport</span>
          </div>
          {homeAirport ? (
            <div className="text-xs text-gray-300">
              <div className="font-medium text-green-400">{homeAirport.iata_code}</div>
              <div>{homeAirport.city}</div>
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
          <div>• Hover over airports to see details</div>
          <div>• Click "Set Home" to set home airport</div>
          <div>• Click "Select Route" for flight search</div>
          <div>• Routes show from your home airport</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGlobeMap;
