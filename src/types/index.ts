// Common types for the wildlife monitoring system

export interface Tiger {
  id: string;
  name: string | null;
  sex: 'Male' | 'Female';
  age_class: 'Adult' | 'Sub-adult' | 'Juvenile';
  state: string;
  district: string;
  reserve: string;
  stripe_match_id: string | null;
  confidence: number | null;
  image_count: number;
  last_seen: string;
  status: 'Alive' | 'Monitoring' | 'Missing' | 'Dead';
  collared: boolean;
  collar_id: string | null;
  battery: number | null;
  signal: 'Strong' | 'Medium' | 'Weak' | null;
  conflicts: number;
  coordinates: string;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Elephant {
  id: string;
  name: string | null;
  sex: 'Male' | 'Female';
  age_class: 'Adult' | 'Sub-adult' | 'Juvenile';
  state: string;
  district: string;
  reserve: string;
  collared: boolean;
  collar_id: string | null;
  last_location: string;
  latitude: number | null;
  longitude: number | null;
  movement_distance: number | null;
  battery: number | null;
  signal: 'Strong' | 'Medium' | 'Weak' | null;
  last_transmission: string | null;
  status: 'Active' | 'Inactive' | 'Missing';
  coordinates: string;
  weight: number | null;
  health_status: string | null;
  last_seen: string;
  conflicts: number;
  created_at?: string;
  updated_at?: string;
}

export interface Conflict {
  id: string;
  type: 'Crop Damage' | 'Human Injury' | 'Livestock Loss' | 'Property Damage' | 'Other';
  severity: 'High' | 'Medium' | 'Low';
  species: 'Tiger' | 'Elephant' | 'Other';
  animal_id: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  status: 'Under Investigation' | 'Resolved' | 'Compensated' | 'Pending';
  casualties: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Sighting {
  id: string;
  animal_id: string;
  species: 'Tiger' | 'Elephant';
  name: string | null;
  location: string;
  reserve: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  sex: 'Male' | 'Female';
  age: 'Adult' | 'Sub-adult' | 'Juvenile';
  status: 'Collared' | 'Uncollared';
  sighted_at: string;
  created_at?: string;
}

export interface StripeIdentificationResult {
  tiger_id: string;
  name: string | null;
  reserve: string;
  last_seen: string;
  status: string;
  confidence: number;
  alternative_matches?: Array<{
    tiger_id: string;
    name: string | null;
    confidence: number;
  }>;
}

export interface FilterParams {
  state?: string;
  district?: string;
  reserve?: string;
  year?: string;
  species?: 'Tiger' | 'Elephant';
  status?: string;
  search?: string;
}

export interface Stats {
  total_tigers: number;
  total_elephants: number;
  collared_animals: number;
  active_conflicts: number;
  tiger_trend?: number;
  elephant_trend?: number;
  collared_trend?: number;
  conflict_trend?: number;
}

