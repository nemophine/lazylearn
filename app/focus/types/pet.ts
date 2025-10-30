// Pet types for the Focus Mode feature

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  level: number;
  exp: number;
  health: number;
  hunger: number;
  energy: number;
  clean: number;
  happy: number;
  lastCare: string; // ISO timestamp
  accessories: string[];
}

export type PetType = 'cat' | 'dog' | 'fox' | 'panda' | 'owl';

export interface PetCare {
  health?: number;
  hunger?: number;
  energy?: number;
  clean?: number;
  happy?: number;
  exp?: number;
}

export interface PetStatus {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: string;
}

export interface FocusReward {
  exp: number;
  care: PetCare;
  message: string;
}

// Pet configurations
export const PET_CONFIGS = {
  cat: { name: 'Mochi', emoji: '🐱', baseStats: { health: 100, hunger: 80, energy: 90, clean: 85, happy: 75 } },
  dog: { name: 'Buddy', emoji: '🐶', baseStats: { health: 100, hunger: 85, energy: 95, clean: 80, happy: 80 } },
  fox: { name: 'Clever', emoji: '🦊', baseStats: { health: 100, hunger: 75, energy: 85, clean: 90, happy: 70 } },
  panda: { name: 'Bamboo', emoji: '🐼', baseStats: { health: 100, hunger: 70, energy: 75, clean: 80, happy: 85 } },
  owl: { name: 'Wise', emoji: '🦉', baseStats: { health: 100, hunger: 80, energy: 80, clean: 85, happy: 75 } },
};

// Default pet for new users
export const DEFAULT_PET: Omit<Pet, 'id' | 'lastCare'> = {
  name: 'Mochi',
  type: 'cat',
  level: 1,
  exp: 0,
  health: 100,
  hunger: 80,
  energy: 90,
  clean: 85,
  happy: 75,
  accessories: [],
};