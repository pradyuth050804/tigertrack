import { useQuery } from '@tanstack/react-query';
import { getTigers, getTigerById } from '@/lib/animal-services';
import type { Tiger, FilterParams } from '@/types';

export const useTigers = (filters?: FilterParams) => {
  return useQuery({
    queryKey: ['tigers', filters],
    queryFn: () => getTigers(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useTiger = (id: string) => {
  return useQuery({
    queryKey: ['tiger', id],
    queryFn: () => getTigerById(id),
    enabled: !!id,
  });
};

