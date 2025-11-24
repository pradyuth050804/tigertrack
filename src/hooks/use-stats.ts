import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/supabase-services';
import type { Stats } from '@/types';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats(),
    staleTime: 60000, // 1 minute
  });
};

