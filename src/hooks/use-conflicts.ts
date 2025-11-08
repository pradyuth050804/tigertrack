import { useQuery } from '@tanstack/react-query';
import { getConflicts, getConflictById } from '@/lib/supabase-services';
import type { Conflict, FilterParams } from '@/types';

export const useConflicts = (filters?: FilterParams) => {
  return useQuery({
    queryKey: ['conflicts', filters],
    queryFn: () => getConflicts(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useConflict = (id: string) => {
  return useQuery({
    queryKey: ['conflict', id],
    queryFn: () => getConflictById(id),
    enabled: !!id,
  });
};

