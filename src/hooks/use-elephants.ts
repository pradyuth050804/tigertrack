import { useQuery } from '@tanstack/react-query';
import { getElephants, getElephantById } from '@/lib/animal-services';
import type { Elephant, FilterParams } from '@/types';

export const useElephants = (filters?: FilterParams) => {
  return useQuery({
    queryKey: ['elephants', filters],
    queryFn: () => getElephants(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useElephant = (id: string) => {
  return useQuery({
    queryKey: ['elephant', id],
    queryFn: () => getElephantById(id),
    enabled: !!id,
  });
};

