import { useQuery } from '@tanstack/react-query';
import { getAnimalLocations } from '@/lib/supabase-services';

export const useAnimalLocations = (species?: 'Tiger' | 'Elephant') => {
  return useQuery({
    queryKey: ['locations', species],
    queryFn: () => getAnimalLocations(species),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for live tracking
  });
};

