
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;
type UserHomeAirport = Tables<'user_home_airports'> & {
  airports: Airport;
};

export const useAirports = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [homeAirports, setHomeAirports] = useState<Airport[]>([]);
  const [primaryHomeAirport, setPrimaryHomeAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load all major airports
  useEffect(() => {
    const loadAirports = async () => {
      const { data, error } = await supabase
        .from('airports')
        .select('*')
        .eq('is_major', true)
        .order('name');

      if (error) {
        console.error('Error loading airports:', error);
        return;
      }

      setAirports(data || []);
    };

    loadAirports();
  }, []);

  // Load user's home airports
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
        setLoading(false);
        return;
      }

      const homeAirportsList = data?.map(item => item.airports).filter(Boolean) as Airport[] || [];
      setHomeAirports(homeAirportsList);
      
      // Find primary home airport
      const primaryHome = data?.find(item => item.is_primary);
      if (primaryHome && primaryHome.airports) {
        setPrimaryHomeAirport(primaryHome.airports as Airport);
      } else if (homeAirportsList.length > 0) {
        setPrimaryHomeAirport(homeAirportsList[0]);
      }

      setLoading(false);
    };

    loadHomeAirports();
  }, [user]);

  const addHomeAirport = async (airportId: string, isPrimary: boolean = false) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // If setting as primary, remove primary status from other airports
      if (isPrimary) {
        await supabase
          .from('user_home_airports')
          .update({ is_primary: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase
        .from('user_home_airports')
        .upsert({
          user_id: user.id,
          airport_id: airportId,
          is_primary: isPrimary
        });

      if (error) throw error;

      // Refresh home airports
      const airport = airports.find(a => a.id === airportId);
      if (airport) {
        if (!homeAirports.find(h => h.id === airportId)) {
          setHomeAirports([...homeAirports, airport]);
        }
        if (isPrimary) {
          setPrimaryHomeAirport(airport);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error adding home airport:', error);
      return { error: 'Failed to add home airport' };
    }
  };

  const removeHomeAirport = async (airportId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('user_home_airports')
        .delete()
        .eq('user_id', user.id)
        .eq('airport_id', airportId);

      if (error) throw error;

      // Update local state
      setHomeAirports(homeAirports.filter(a => a.id !== airportId));
      
      if (primaryHomeAirport?.id === airportId) {
        const remainingHomes = homeAirports.filter(a => a.id !== airportId);
        setPrimaryHomeAirport(remainingHomes.length > 0 ? remainingHomes[0] : null);
      }

      return { error: null };
    } catch (error) {
      console.error('Error removing home airport:', error);
      return { error: 'Failed to remove home airport' };
    }
  };

  const setPrimaryHome = async (airportId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Remove primary status from all airports
      await supabase
        .from('user_home_airports')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Set new primary
      const { error } = await supabase
        .from('user_home_airports')
        .update({ is_primary: true })
        .eq('user_id', user.id)
        .eq('airport_id', airportId);

      if (error) throw error;

      const airport = airports.find(a => a.id === airportId);
      if (airport) {
        setPrimaryHomeAirport(airport);
      }

      return { error: null };
    } catch (error) {
      console.error('Error setting primary home airport:', error);
      return { error: 'Failed to set primary home airport' };
    }
  };

  return {
    airports,
    homeAirports,
    primaryHomeAirport,
    loading,
    addHomeAirport,
    removeHomeAirport,
    setPrimaryHome
  };
};
