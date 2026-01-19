
export type Country = 'Kenya' | 'Uganda';

export interface Organization {
  id: string;
  name: string;
  country: Country;
  city: string;
  programType: string;
  ceo: string;
  contact: string;
}

export interface ResearchStats {
  internetPenetration: number;
  mobileUsage: number;
  youthPopulation: number;
}

export interface Reflection {
  content: string;
  lastUpdated: string;
}

export interface AppState {
  organizations: Organization[];
  reflection: string;
  isLoading: boolean;
  error: string | null;
}
