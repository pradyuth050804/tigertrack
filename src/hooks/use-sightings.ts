import { useQuery } from '@tanstack/react-query';
import { getRecentSightings } from '@/lib/supabase-services';
import type { Sighting } from '@/types';

export const useRecentSightings = (limit: number = 10) => {
  return useQuery({
    queryKey: ['sightings', 'recent', limit],
    queryFn: () => getRecentSightings(limit),
    staleTime: 10000, // 10 seconds - sightings update frequently
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};

