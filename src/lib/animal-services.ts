import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import type { Tiger, Elephant, Conflict, Sighting, FilterParams, Stats, StripeIdentificationResult } from '@/types';
import { getMockTigers } from './mock-data/tigers';
import { getMockElephants } from './mock-data/elephants';

// ============================================================================
// TIGER SERVICES
// ============================================================================

export const getTigers = async (filters?: FilterParams): Promise<Tiger[]> => {
  if (!isSupabaseConfigured()) {
    return getMockTigers();
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockTigers();
    }
    let query = supabase.from('tigers').select('*');

    if (filters?.state && filters.state !== 'all-states') {
      query = query.eq('state', filters.state);
    }
    if (filters?.district && filters.district !== 'all-districts') {
      query = query.eq('district', filters.district);
    }
    if (filters?.reserve && filters.reserve !== 'all-reserves') {
      query = query.eq('reserve', filters.reserve);
    }
    if (filters?.status && filters.status !== 'all-status') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`id.ilike.%${filters.search}%,name.ilike.%${filters.search}%,reserve.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('last_seen', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tigers:', error);
    return getMockTigers();
  }
};

export const getTigerById = async (id: string): Promise<Tiger | null> => {
  if (!isSupabaseConfigured()) {
    return getMockTigers().find(t => t.id === id) || null;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockTigers().find(t => t.id === id) || null;
    }
    const { data, error } = await supabase
      .from('tigers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tiger:', error);
    return getMockTigers().find(t => t.id === id) || null;
  }
};

// ============================================================================
// ELEPHANT SERVICES
// ============================================================================

export const getElephants = async (filters?: FilterParams): Promise<Elephant[]> => {
  if (!isSupabaseConfigured()) {
    return getMockElephants();
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockElephants();
    }
    let query = supabase.from('elephants').select('*');

    if (filters?.state && filters.state !== 'all-states') {
      query = query.eq('state', filters.state);
    }
    if (filters?.district && filters.district !== 'all-districts') {
      query = query.eq('district', filters.district);
    }
    if (filters?.reserve && filters.reserve !== 'all-reserves') {
      query = query.eq('reserve', filters.reserve);
    }
    if (filters?.status && filters.status !== 'all-status') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`id.ilike.%${filters.search}%,name.ilike.%${filters.search}%,reserve.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('last_seen', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching elephants:', error);
    return getMockElephants();
  }
};

export const getElephantById = async (id: string): Promise<Elephant | null> => {
  if (!isSupabaseConfigured()) {
    return getMockElephants().find(e => e.id === id) || null;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockElephants().find(e => e.id === id) || null;
    }
    const { data, error } = await supabase
      .from('elephants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching elephant:', error);
    return getMockElephants().find(e => e.id === id) || null;
  }
};