// Local storage utilities for pet and focus data

import { Pet } from '../types/pet';

const STORAGE_KEYS = {
  PET: 'focus_pet_data',
  STATS: 'focus_stats_data',
  SETTINGS: 'focus_settings'
};

interface FocusStats {
  totalFocusTime: number; // in seconds
  sessionsCompleted: number;
  lastFocusDate: string;
  currentStreak: number;
}

interface FocusSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  preferredPetType?: string;
}

// Pet data management
export const savePetData = (pet: Pet): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(pet));
  } catch (error) {
    console.error('Failed to save pet data:', error);
  }
};

export const loadPetData = (): Pet | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PET);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load pet data:', error);
    return null;
  }
};

export const createDefaultPet = (): Pet => {
  const defaultPet: Pet = {
    id: `pet_${Date.now()}`,
    name: 'Mochi',
    type: 'cat',
    level: 1,
    exp: 0,
    health: 100,
    hunger: 80,
    energy: 90,
    clean: 85,
    happy: 75,
    lastCare: new Date().toISOString(),
    accessories: []
  };

  savePetData(defaultPet);
  return defaultPet;
};

// Stats data management
export const saveStatsData = (stats: FocusStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats data:', error);
  }
};

export const loadStatsData = (): FocusStats => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : {
      totalFocusTime: 0,
      sessionsCompleted: 0,
      lastFocusDate: '',
      currentStreak: 0
    };
  } catch (error) {
    console.error('Failed to load stats data:', error);
    return {
      totalFocusTime: 0,
      sessionsCompleted: 0,
      lastFocusDate: '',
      currentStreak: 0
    };
  }
};

// Settings management
export const saveSettingsData = (settings: FocusSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings data:', error);
  }
};

export const loadSettingsData = (): FocusSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
      notificationsEnabled: true
    };
  } catch (error) {
    console.error('Failed to load settings data:', error);
    return {
      soundEnabled: true,
      notificationsEnabled: true
    };
  }
};

// Utility functions
export const updateFocusStats = (sessionDuration: number): FocusStats => {
  const currentStats = loadStatsData();
  const today = new Date().toISOString().split('T')[0];

  const newStats: FocusStats = {
    totalFocusTime: currentStats.totalFocusTime + sessionDuration,
    sessionsCompleted: currentStats.sessionsCompleted + 1,
    lastFocusDate: today,
    currentStreak: currentStats.lastFocusDate === today ?
      currentStats.currentStreak + 1 : 1
  };

  saveStatsData(newStats);
  return newStats;
};

export const clearAllFocusData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear focus data:', error);
  }
};