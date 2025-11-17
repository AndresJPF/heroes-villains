export interface PowerStats {
  intelligence: number;
  strength: number;
  speed: number;
  durability?: number;
  power?: number;
  combat?: number;
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  universe: 'Marvel' | 'DC' | 'Original' | string;
  affiliation: 'Hero' | 'Villain' | 'Neutral';
  powerStats: PowerStats;
  powers: string[];
  weaknesses: string[];
  firstAppearance: number;
  rating: number;
  image: string;
  biography?: string;
  links?: {
    wiki?: string;
    comic?: string;
  };
}

export interface CharacterFilter {
  universe?: string;
  affiliation?: string;
  power?: string;
  search?: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'rating-desc' | 'rating-asc';