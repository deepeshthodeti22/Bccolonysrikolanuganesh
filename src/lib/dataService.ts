import initialFestival from '../../data/festival.json';
import initialEvents from '../../data/events.json';
import initialAnnouncements from '../../data/announcements.json';
import initialPrasad from '../../data/prasad.json';
import initialCompetitions from '../../data/competitions.json';
import initialSports from '../../data/sports.json';
import initialGallery from '../../data/gallery.json';
import initialDarshan from '../../data/live-darshan.json';
import initialBroadcasts from '../../data/broadcasts.json';
import initialSettings from '../../data/settings.json';
import initialFinance from '../../data/finance.json';

import {
  FestivalConfig,
  DayItinerary,
  Announcement,
  PrasadItem,
  Competition,
  LeaderboardEntry,
  LiveDarshanConfig,
  BroadcastMessage,
  FestivalSettings,
  FinanceSummary,
  GalleryItem,
  AchievementRecord,
  HistoricalVaultItem,
} from '../types';

export interface SportsData {
  tournamentTitle: string;
  venue: string;
  dates: string;
  liveMatch: {
    tournament: string;
    team1: string;
    team1Score: number;
    team2: string;
    team2Score: number;
    half: string;
    court: string;
    status: string;
    lastUpdated: string;
  };
  leaderboard: LeaderboardEntry[];
}

export interface GalleryData {
  achievements: AchievementRecord[];
  moments: GalleryItem[];
  vault: HistoricalVaultItem[];
}

// Local storage keys for runtime editing cache
const STORAGE_PREFIX = 'svm_json_';

function getStoredOrInitial<T>(key: string, initialData: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // Ignore storage parse error
  }
  return initialData;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage write error
  }
}

export const dataService = {
  // 1. Festival general info
  getFestival: (): FestivalConfig => getStoredOrInitial('festival', initialFestival as FestivalConfig),
  saveFestival: (data: FestivalConfig) => saveToStorage('festival', data),

  // 2. Schedule / Itinerary
  getEvents: (): DayItinerary[] => getStoredOrInitial('events', initialEvents as DayItinerary[]),
  saveEvents: (data: DayItinerary[]) => saveToStorage('events', data),

  // 3. Announcements
  getAnnouncements: (): Announcement[] => getStoredOrInitial('announcements', initialAnnouncements as Announcement[]),
  saveAnnouncements: (data: Announcement[]) => saveToStorage('announcements', data),

  // 4. Prasad
  getPrasad: (): PrasadItem[] => getStoredOrInitial('prasad', initialPrasad as PrasadItem[]),
  savePrasad: (data: PrasadItem[]) => saveToStorage('prasad', data),

  // 5. Competitions
  getCompetitions: (): Competition[] => getStoredOrInitial('competitions', initialCompetitions as Competition[]),
  saveCompetitions: (data: Competition[]) => saveToStorage('competitions', data),

  // 6. Sports
  getSports: (): SportsData => getStoredOrInitial('sports', initialSports as SportsData),
  saveSports: (data: SportsData) => saveToStorage('sports', data),

  // 7. Live Darshan
  getDarshan: (): LiveDarshanConfig => getStoredOrInitial('darshan', initialDarshan as LiveDarshanConfig),
  saveDarshan: (data: LiveDarshanConfig) => saveToStorage('darshan', data),

  // 8. Gallery & Achievements
  getGallery: (): GalleryData => getStoredOrInitial('gallery', initialGallery as GalleryData),
  saveGallery: (data: GalleryData) => saveToStorage('gallery', data),

  // 9. Broadcasts
  getBroadcasts: (): BroadcastMessage[] => getStoredOrInitial('broadcasts', initialBroadcasts as BroadcastMessage[]),
  saveBroadcasts: (data: BroadcastMessage[]) => saveToStorage('broadcasts', data),

  // 10. Settings
  getSettings: (): FestivalSettings => getStoredOrInitial('settings', initialSettings as FestivalSettings),
  saveSettings: (data: FestivalSettings) => saveToStorage('settings', data),

  // 11. Finance (Admin-only)
  getFinance: (): FinanceSummary => getStoredOrInitial('finance', initialFinance as FinanceSummary),
  saveFinance: (data: FinanceSummary) => saveToStorage('finance', data),

  // Export full JSON bundle for easy download/commit to GitHub
  exportAllData: () => {
    return {
      festival: dataService.getFestival(),
      events: dataService.getEvents(),
      announcements: dataService.getAnnouncements(),
      prasad: dataService.getPrasad(),
      competitions: dataService.getCompetitions(),
      sports: dataService.getSports(),
      darshan: dataService.getDarshan(),
      gallery: dataService.getGallery(),
      broadcasts: dataService.getBroadcasts(),
      settings: dataService.getSettings(),
      finance: dataService.getFinance(),
      exportedAt: new Date().toISOString(),
    };
  },

  // Reset to original JSON defaults
  resetToDefaults: () => {
    const keys = ['festival', 'events', 'announcements', 'prasad', 'competitions', 'sports', 'darshan', 'gallery', 'broadcasts', 'settings', 'finance'];
    keys.forEach((k) => localStorage.removeItem(`${STORAGE_PREFIX}${k}`));
  },
};
