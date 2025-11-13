import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import type { Tiger, Elephant, Conflict, Sighting, FilterParams, Stats, StripeIdentificationResult } from '@/types';
import { getMockElephants } from './mock-elephants';

// ============================================================================
// TIGER SERVICES
// ============================================================================

export const getTigers = async (filters?: FilterParams): Promise<Tiger[]> => {
  if (!isSupabaseConfigured()) {
    // Return mock data if Supabase is not configured
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
    // Fallback to mock data on error
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
    return null;
  }
};

// ============================================================================
// ELEPHANT SERVICES
// ============================================================================

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
    return null;
  }
};

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

    const { data, error } = await query.order('last_transmission', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching elephants:', error);
    return getMockElephants();
  }
};

// ============================================================================
// CONFLICT SERVICES
// ============================================================================

export const getConflicts = async (filters?: FilterParams): Promise<Conflict[]> => {
  if (!isSupabaseConfigured()) {
    return getMockConflicts();
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockConflicts();
    }
    let query = supabase.from('conflicts').select('*');

    if (filters?.state && filters.state !== 'all-states') {
      query = query.eq('state', filters.state);
    }
    if (filters?.severity && filters.severity !== 'all-severity') {
      query = query.eq('severity', filters.severity);
    }
    if (filters?.status && filters.status !== 'all-status') {
      query = query.eq('status', filters.status);
    }
    if (filters?.species && filters.species !== 'all-species') {
      query = query.eq('species', filters.species);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching conflicts:', error);
    return getMockConflicts();
  }
};

export const getConflictById = async (id: string): Promise<Conflict | null> => {
  if (!isSupabaseConfigured()) {
    return getMockConflicts().find(c => c.id === id) || null;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockConflicts().find(c => c.id === id) || null;
    }
    const { data, error } = await supabase
      .from('conflicts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching conflict:', error);
    return null;
  }
};

// ============================================================================
// SIGHTING SERVICES
// ============================================================================

export const getRecentSightings = async (limit: number = 10): Promise<Sighting[]> => {
  if (!isSupabaseConfigured()) {
    return getMockSightings().slice(0, limit);
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockSightings().slice(0, limit);
    }
    const { data, error } = await supabase
      .from('sightings')
      .select('*')
      .order('sighted_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sightings:', error);
    return getMockSightings().slice(0, limit);
  }
};

// ============================================================================
// MAP SERVICES
// ============================================================================

export const getAnimalLocations = async (species?: 'Tiger' | 'Elephant'): Promise<Array<{ id: string; name: string | null; type: string; location: string; status: string; lat: number; lng: number }>> => {
  if (!isSupabaseConfigured()) {
    return getMockLocations(species);
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockLocations(species);
    }
    const locations: Array<{ id: string; name: string | null; type: string; location: string; status: string; lat: number; lng: number }> = [];

    if (!species || species === 'Tiger') {
      const { data: tigers } = await supabase
        .from('tigers')
        .select('id, name, reserve, status, latitude, longitude')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (tigers) {
        tigers.forEach(tiger => {
          if (tiger.latitude && tiger.longitude) {
            locations.push({
              id: tiger.id,
              name: tiger.name,
              type: 'tiger',
              location: tiger.reserve,
              status: tiger.status,
              lat: tiger.latitude,
              lng: tiger.longitude,
            });
          }
        });
      }
    }

    if (!species || species === 'Elephant') {
      const { data: elephants } = await supabase
        .from('elephants')
        .select('id, name, reserve, status, latitude, longitude')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (elephants) {
        elephants.forEach(elephant => {
          if (elephant.latitude && elephant.longitude) {
            locations.push({
              id: elephant.id,
              name: elephant.name,
              type: 'elephant',
              location: elephant.reserve,
              status: elephant.status,
              lat: elephant.latitude,
              lng: elephant.longitude,
            });
          }
        });
      }
    }

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return getMockLocations(species);
  }
};

// ============================================================================
// STATS SERVICES
// ============================================================================

export const getStats = async (): Promise<Stats> => {
  if (!isSupabaseConfigured()) {
    return getMockStats();
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return getMockStats();
    }
    // Fetch counts from Supabase
    const [tigersResult, elephantsResult, conflictsResult, collaredResult] = await Promise.all([
      supabase.from('tigers').select('id', { count: 'exact', head: true }),
      supabase.from('elephants').select('id', { count: 'exact', head: true }),
      supabase.from('conflicts').select('id', { count: 'exact', head: true }).eq('status', 'Under Investigation'),
      supabase.from('tigers').select('id', { count: 'exact', head: true }).eq('collared', true),
    ]);

    const totalTigers = tigersResult.count || 0;
    const totalElephants = elephantsResult.count || 0;
    const activeConflicts = conflictsResult.count || 0;
    const collaredTigers = collaredResult.count || 0;

    // Get collared elephants count
    const { count: collaredElephants } = await supabase
      .from('elephants')
      .select('id', { count: 'exact', head: true })
      .eq('collared', true);

    const collaredAnimals = collaredTigers + (collaredElephants || 0);

    return {
      total_tigers: totalTigers,
      total_elephants: totalElephants,
      collared_animals: collaredAnimals,
      active_conflicts: activeConflicts,
      tiger_trend: 8.2,
      elephant_trend: 3.5,
      collared_trend: 3,
      conflict_trend: -15.3,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return getMockStats();
  }
};

// ============================================================================
// STRIPE IDENTIFICATION SERVICES
// ============================================================================

export const identifyTiger = async (
  leftFlankImage: File,
  rightFlankImage: File
): Promise<StripeIdentificationResult | null> => {
  // Mock identification result when Supabase is not configured
  const mockResult = {
    tiger_id: 'IN-MP-045',
    name: 'Collarwali',
    reserve: 'Pench Tiger Reserve',
    last_seen: '2024-01-15',
    status: 'Alive',
    confidence: 95.2,
    alternative_matches: [
      { tiger_id: 'IN-RJ-012', name: 'T-91', confidence: 87.3 },
      { tiger_id: 'IN-KA-078', name: 'Bandipur Male', confidence: 82.1 },
    ],
  };

  if (!isSupabaseConfigured()) {
    return mockResult;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockResult;
    }

    // Upload both images to Supabase Storage
    const uploadImage = async (file: File, side: 'left' | 'right') => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${side}-${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `tiger-identification/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tiger-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tiger-images')
        .getPublicUrl(filePath);

      return publicUrl;
    };

    // Upload both images in parallel
    const [leftFlankUrl, rightFlankUrl] = await Promise.all([
      uploadImage(leftFlankImage, 'left'),
      uploadImage(rightFlankImage, 'right'),
    ]);

    // Call Supabase Edge Function for stripe identification
    // This would typically call a machine learning model that analyzes both images
    // The backend should:
    // 1. Extract stripe patterns from both left and right flank images
    // 2. Match against the database of known tigers
    // 3. Return the best match with confidence score
    const { data, error } = await supabase.functions.invoke('identify-tiger', {
      body: {
        left_flank_url: leftFlankUrl,
        right_flank_url: rightFlankUrl,
        // Optional: include image metadata
        left_flank_filename: leftFlankImage.name,
        right_flank_filename: rightFlankImage.name,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error identifying tiger:', error);
    // Return mock result on error for development
    return mockResult;
  }
};

// Create a new tiger record. Generates an ID like IN-<STATE>-<NNN> by
// scanning existing tiger IDs for that state and incrementing the max.
export const createTiger = async (
  name: string,
  stateCode: string = 'MP',
  leftFlankImage?: File | null,
  rightFlankImage?: File | null
): Promise<Tiger | null> => {
  // When Supabase isn't configured return a mock object
  if (!isSupabaseConfigured()) {
    const generatedId = `IN-${stateCode}-${String(Math.floor(Date.now() % 1000)).padStart(3, '0')}`;
    return {
      id: generatedId,
      name,
      sex: 'Unknown',
      age_class: 'Unknown',
      state: stateCode,
      district: '',
      reserve: '',
      stripe_match_id: null,
      confidence: null,
      image_count: (leftFlankImage || rightFlankImage) ? 2 : 0,
      last_seen: null,
      status: 'Unknown',
      collared: false,
      collar_id: null,
      battery: null,
      signal: null,
      conflicts: 0,
      coordinates: null,
      latitude: null,
      longitude: null,
    } as unknown as Tiger;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    // Find existing IDs for this state code and compute next number
    const likePattern = `IN-${stateCode}-%`;
    const { data: existingIds, error: fetchError } = await supabase
      .from('tigers')
      .select('id')
      .like('id', likePattern);

    if (fetchError) throw fetchError;

    let nextNumber = 1;
    if (existingIds && existingIds.length > 0) {
      const nums = existingIds
        .map((r: any) => {
          const parts = (r.id || '').split('-');
          const num = parts[2] ? parseInt(parts[2], 10) : NaN;
          return Number.isFinite(num) ? num : null;
        })
        .filter((n: number | null) => n !== null) as number[];
      if (nums.length > 0) {
        nextNumber = Math.max(...nums) + 1;
      }
    }

    const generatedId = `IN-${stateCode}-${String(nextNumber).padStart(3, '0')}`;

    // Helper to upload an image and return public URL (if provided)
    const uploadImage = async (file?: File | null, side?: string) => {
      if (!file) return null;
      const fileExt = file.name.split('.').pop();
      const fileName = `${side || 'img'}-${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `tigers/${generatedId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('tiger-images')
        .upload(filePath, file);
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }
      const { data: { publicUrl } } = supabase.storage.from('tiger-images').getPublicUrl(filePath);
      return publicUrl;
    };

    const [leftUrl, rightUrl] = await Promise.all([
      uploadImage(leftFlankImage, 'left'),
      uploadImage(rightFlankImage, 'right'),
    ]);

    const insertPayload: any = {
      id: generatedId,
      name,
      state: stateCode,
      image_count: (leftUrl || rightUrl) ? 2 : 0,
      left_image_url: leftUrl || null,
      right_image_url: rightUrl || null,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await supabase
      .from('tigers')
      .insert([insertPayload])
      .select()
      .single();

    if (insertError) throw insertError;
    return inserted as Tiger;
  } catch (error) {
    console.error('Error creating tiger:', error);
    return null;
  }
};

// Create a new elephant record. Similar to createTiger but inserts into elephants table.
export const createElephant = async (
  name: string,
  stateCode: string = 'KA',
  leftImage?: File | null,
  rightImage?: File | null
): Promise<Elephant | null> => {
  if (!isSupabaseConfigured()) {
    const generatedId = `IN-${stateCode}-${String(Math.floor(Date.now() % 1000)).padStart(3, '0')}`;
    return {
      id: generatedId,
      name,
      sex: 'Unknown',
      age_class: 'Unknown',
      state: stateCode,
      district: '',
      reserve: '',
      collared: false,
      collar_id: null,
      last_location: null,
      latitude: null,
      longitude: null,
      movement_distance: null,
      battery: null,
      signal: null,
      last_transmission: null,
      status: 'Unknown',
    } as unknown as Elephant;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const likePattern = `IN-${stateCode}-%`;
    const { data: existingIds, error: fetchError } = await supabase
      .from('elephants')
      .select('id')
      .like('id', likePattern);

    if (fetchError) throw fetchError;

    let nextNumber = 1;
    if (existingIds && existingIds.length > 0) {
      const nums = existingIds
        .map((r: any) => {
          const parts = (r.id || '').split('-');
          const num = parts[2] ? parseInt(parts[2], 10) : NaN;
          return Number.isFinite(num) ? num : null;
        })
        .filter((n: number | null) => n !== null) as number[];
      if (nums.length > 0) nextNumber = Math.max(...nums) + 1;
    }

    const generatedId = `IN-${stateCode}-${String(nextNumber).padStart(3, '0')}`;

    const uploadImage = async (file?: File | null, side?: string) => {
      if (!file) return null;
      const fileExt = file.name.split('.').pop();
      const fileName = `${side || 'img'}-${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `elephants/${generatedId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('tiger-images').upload(filePath, file);
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }
      const { data: { publicUrl } } = supabase.storage.from('tiger-images').getPublicUrl(filePath);
      return publicUrl;
    };

    const [leftUrl, rightUrl] = await Promise.all([
      uploadImage(leftImage, 'left'),
      uploadImage(rightImage, 'right'),
    ]);

    const insertPayload: any = {
      id: generatedId,
      name,
      state: stateCode,
      image_count: (leftUrl || rightUrl) ? 2 : 0,
      left_image_url: leftUrl || null,
      right_image_url: rightUrl || null,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await supabase
      .from('elephants')
      .insert([insertPayload])
      .select()
      .single();

    if (insertError) throw insertError;
    return inserted as Elephant;
  } catch (error) {
    console.error('Error creating elephant:', error);
    return null;
  }
};

// -------------------------
// Email/Password Auth helpers
// -------------------------

// Mock users database
const MOCK_USERS = [
  { email: 'pradyuthurs@gmail.com', password: 'Pradyuth', role: 'administrator' as const },
  { email: 'user@tigertrack.local', password: 'password123', role: 'user' as const },
  { email: 'test@example.com', password: 'test123', role: 'user' as const },
];

/**
 * authenticateUser: verifies email and password. When Supabase isn't
 * configured, uses mock users database. Returns success status and role.
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; role?: 'administrator' | 'user' }> => {
  if (!isSupabaseConfigured()) {
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      return { success: true, role: user.role };
    }
    return { success: false };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Fallback to mock if no supabase
      const user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      return user ? { success: true, role: user.role } : { success: false };
    }

    // Attempt Supabase auth signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Fetch user role from users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('email', email)
      .single();

    return { success: !!data, role: (userData?.role as 'administrator' | 'user') || 'user' };
  } catch (error) {
    console.error('authenticateUser error', error);
    return { success: false };
  }
};

/**
 * getUserRole: fetches the role for a given email from a mock users table
 * or from a Supabase users table. Returns 'administrator' | 'user' or undefined if not found.
 */
export const getUserRole = async (email: string): Promise<'administrator' | 'user' | undefined> => {
  const mockUsers = [
    { email: 'admin@tigertrack.local', role: 'administrator' as const },
    { email: 'user@tigertrack.local', role: 'user' as const },
    { email: 'test@example.com', role: 'user' as const },
  ];

  if (!isSupabaseConfigured()) {
    const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return mockUser?.role;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return mockUser?.role;
    }

    // Try to fetch from users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', email)
      .single();

    if (error) {
      console.warn('Error fetching user role:', error);
      // Fallback to mock if table doesn't exist or other error
      const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return mockUser?.role;
    }

    return userData && (userData.role as 'administrator' | 'user' | undefined);
  } catch (error) {
    console.error('getUserRole error:', error);
    const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return mockUser?.role;
  }
};

// ============================================================================
// MOCK DATA (Fallback when Supabase is not configured)
// ============================================================================

const getMockTigers = (): Tiger[] => [
  {
    id: 'IN-MP-045',
    name: 'Collarwali',
    sex: 'Female',
    age_class: 'Adult',
    state: 'Madhya Pradesh',
    district: 'Seoni',
    reserve: 'Pench Tiger Reserve',
    stripe_match_id: 'SM-2024-045',
    confidence: 98.5,
    image_count: 47,
    last_seen: '2024-01-15',
    status: 'Alive',
    collared: true,
    collar_id: 'PTR-045-C',
    battery: 85,
    signal: 'Strong',
    conflicts: 0,
    coordinates: '21.7679° N, 79.2961° E',
    latitude: 21.7679,
    longitude: 79.2961,
  },
  {
    id: 'IN-RJ-012',
    name: 'T-91',
    sex: 'Male',
    age_class: 'Adult',
    state: 'Rajasthan',
    district: 'Sawai Madhopur',
    reserve: 'Ranthambore',
    stripe_match_id: 'SM-2024-012',
    confidence: 95.2,
    image_count: 123,
    last_seen: '2024-01-14',
    status: 'Monitoring',
    collared: true,
    collar_id: 'RTR-012-C',
    battery: 62,
    signal: 'Medium',
    conflicts: 2,
    coordinates: '26.0173° N, 76.5026° E',
    latitude: 26.0173,
    longitude: 76.5026,
  },
  {
    id: 'IN-KA-078',
    name: 'Bandipur Male',
    sex: 'Male',
    age_class: 'Sub-adult',
    state: 'Karnataka',
    district: 'Chamarajanagar',
    reserve: 'Bandipur National Park',
    stripe_match_id: 'SM-2024-078',
    confidence: 92.8,
    image_count: 34,
    last_seen: '2024-01-13',
    status: 'Alive',
    collared: false,
    collar_id: null,
    battery: null,
    signal: null,
    conflicts: 1,
    coordinates: '11.6643° N, 76.6862° E',
    latitude: 11.6643,
    longitude: 76.6862,
  },
];

const getMockElephants = (): Elephant[] => [
  {
    id: 'IN-KA-023',
    name: 'Tusker Raja',
    sex: 'Male',
    age_class: 'Adult',
    state: 'Karnataka',
    district: 'Chamarajanagar',
    reserve: 'Bandipur National Park',
    collared: true,
    collar_id: 'BNP-023-C',
    last_location: '11.6643° N, 76.6862° E',
    latitude: 11.6643,
    longitude: 76.6862,
    movement_distance: 12.4,
    battery: 78,
    signal: 'Strong',
    last_transmission: '15 min ago',
    status: 'Active',
  },
  {
    id: 'IN-AS-008',
    name: null,
    sex: 'Female',
    age_class: 'Adult',
    state: 'Assam',
    district: 'Golaghat',
    reserve: 'Kaziranga National Park',
    collared: true,
    collar_id: 'KNP-008-C',
    last_location: '26.5775° N, 93.1711° E',
    latitude: 26.5775,
    longitude: 93.1711,
    movement_distance: 8.7,
    battery: 92,
    signal: 'Strong',
    last_transmission: '32 min ago',
    status: 'Active',
  },
  {
    id: 'IN-WB-034',
    name: 'Matriarch Mala',
    sex: 'Female',
    age_class: 'Adult',
    state: 'West Bengal',
    district: 'Alipurduar',
    reserve: 'Jaldapara National Park',
    collared: false,
    collar_id: null,
    last_location: '26.7311° N, 89.2844° E',
    latitude: 26.7311,
    longitude: 89.2844,
    movement_distance: null,
    battery: null,
    signal: null,
    last_transmission: null,
    status: 'Active',
  },
];

const getMockConflicts = (): Conflict[] => [
  {
    id: 'CF-2024-001',
    type: 'Crop Damage',
    severity: 'Medium',
    species: 'Elephant',
    animal_id: 'IN-AS-008',
    location: 'Kaziranga Buffer Zone, Assam',
    latitude: 26.5775,
    longitude: 93.1711,
    date: '2024-01-14',
    status: 'Under Investigation',
    casualties: 'None',
    description: null,
  },
  {
    id: 'CF-2024-002',
    type: 'Human Injury',
    severity: 'High',
    species: 'Tiger',
    animal_id: 'IN-RJ-012',
    location: 'Ranthambore Village Area, Rajasthan',
    latitude: 26.0173,
    longitude: 76.5026,
    date: '2024-01-12',
    status: 'Resolved',
    casualties: '1 injured',
    description: null,
  },
  {
    id: 'CF-2024-003',
    type: 'Livestock Loss',
    severity: 'Low',
    species: 'Tiger',
    animal_id: 'IN-MP-045',
    location: 'Pench Buffer Zone, MP',
    latitude: 21.7679,
    longitude: 79.2961,
    date: '2024-01-10',
    status: 'Compensated',
    casualties: '2 cattle',
    description: null,
  },
];

const getMockSightings = (): Sighting[] => [
  {
    id: 'SIGHT-001',
    animal_id: 'IN-MP-045',
    species: 'Tiger',
    name: 'Collarwali',
    location: 'Pench Tiger Reserve',
    reserve: 'Pench Tiger Reserve',
    coordinates: '21.7679° N, 79.2961° E',
    latitude: 21.7679,
    longitude: 79.2961,
    sex: 'Female',
    age: 'Adult',
    status: 'Collared',
    sighted_at: new Date().toISOString(),
  },
  {
    id: 'SIGHT-002',
    animal_id: 'IN-RJ-012',
    species: 'Tiger',
    name: 'T-91',
    location: 'Ranthambore',
    reserve: 'Ranthambore',
    coordinates: '26.0173° N, 76.5026° E',
    latitude: 26.0173,
    longitude: 76.5026,
    sex: 'Male',
    age: 'Adult',
    status: 'Collared',
    sighted_at: new Date().toISOString(),
  },
  {
    id: 'SIGHT-003',
    animal_id: 'IN-KA-078',
    species: 'Tiger',
    name: 'Bandipur Male',
    location: 'Bandipur National Park',
    reserve: 'Bandipur National Park',
    coordinates: '11.6643° N, 76.6862° E',
    latitude: 11.6643,
    longitude: 76.6862,
    sex: 'Male',
    age: 'Sub-adult',
    status: 'Uncollared',
    sighted_at: new Date().toISOString(),
  },
];

const getMockLocations = (species?: 'Tiger' | 'Elephant') => {
  const locations: Array<{ id: string; name: string | null; type: string; location: string; status: string; lat: number; lng: number }> = [];

  if (!species || species === 'Tiger') {
    locations.push(
      { id: 'IN-MP-045', name: 'Collarwali', type: 'tiger', location: 'Pench, MP', status: 'Active', lat: 21.7679, lng: 79.2961 },
      { id: 'IN-RJ-012', name: 'T-91', type: 'tiger', location: 'Ranthambore, RJ', status: 'Monitoring', lat: 26.0173, lng: 76.5026 },
    );
  }

  if (!species || species === 'Elephant') {
    locations.push(
      { id: 'IN-KA-023', name: 'Tusker Raja', type: 'elephant', location: 'Bandipur, KA', status: 'Active', lat: 11.6643, lng: 76.6862 },
    );
  }

  return locations;
};

const getMockStats = (): Stats => ({
  total_tigers: 3167,
  total_elephants: 27312,
  collared_animals: 428,
  active_conflicts: 23,
  tiger_trend: 8.2,
  elephant_trend: 3.5,
  collared_trend: 3,
  conflict_trend: -15.3,
});

