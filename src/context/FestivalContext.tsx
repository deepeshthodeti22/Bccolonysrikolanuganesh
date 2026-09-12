import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FestivalConfig,
  DayItinerary,
  Ritual,
  Announcement,
  PrasadItem,
  Competition,
  LeaderboardEntry,
  LiveDarshanConfig,
  CameraStream,
  BroadcastMessage,
  FestivalSettings,
  FinanceSummary,
  DonationRecord,
  GalleryItem,
  AchievementRecord,
  HistoricalVaultItem,
} from '../types';
import { dataService, SportsData, GalleryData } from '../lib/dataService';
import { templeAudio } from '../utils/audio';

export interface PrasadToken {
  tokenId: string;
  devoteeName: string;
  phone: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  timestamp: string;
  pickupCounter: string;
  status: 'Ready' | 'Collected';
}

export interface CompetitionRegistration {
  regId: string;
  competitionName: string;
  category: string;
  participantName: string;
  phone: string;
  wardStreet: string;
  registeredAt: string;
}

interface FestivalContextType {
  // 1. Festival Metadata
  festivalInfo: FestivalConfig;
  updateFestivalConfig: (updates: Partial<FestivalConfig>) => void;

  // 2. Schedule & Rituals
  events: DayItinerary[];
  updateRitualStatus: (dayNumber: number, ritualId: string, status: Ritual['status']) => void;
  updateDayItinerary: (dayNumber: number, updates: Partial<DayItinerary>) => void;
  addDayItinerary: (newDay: DayItinerary) => void;
  deleteDayItinerary: (dayNumber: number) => void;

  // 3. Announcements
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, 'id' | 'timestamp'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncement: (id: string) => void;

  // 4. Prasad Items & Booking
  prasadItems: PrasadItem[];
  bookedTokens: PrasadToken[];
  bookPrasad: (itemId: string, quantity: number, devoteeName: string, phone: string) => PrasadToken;
  updatePrasadItem: (id: string, updates: Partial<PrasadItem>) => void;
  addPrasadItem: (item: Omit<PrasadItem, 'id'>) => void;
  deletePrasadItem: (id: string) => void;

  // 5. Competitions
  competitions: Competition[];
  registeredParticipants: CompetitionRegistration[];
  registerForCompetition: (compId: string, participantName: string, phone: string, wardStreet: string, category: string) => CompetitionRegistration;
  addCompetition: (comp: Omit<Competition, 'id' | 'registeredCount'>) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;

  // 6. Sports & Tournament
  sportsData: SportsData;
  leaderboard: LeaderboardEntry[];
  liveMatch: SportsData['liveMatch'];
  updateLiveMatchScore: (team1Score: number, team2Score: number, team1?: string, team2?: string, status?: string) => void;
  updateLeaderboardScore: (teamName: string, points: number, matchStatus?: string) => void;

  // 7. Live Darshan
  darshanConfig: LiveDarshanConfig;
  liveStreamWatching: number;
  activeCamera: string;
  setActiveCamera: (camId: string) => void;
  updateCameraStream: (camId: string, updates: Partial<CameraStream>) => void;
  addCameraStream: (camera: Omit<CameraStream, 'id'>) => void;
  deleteCameraStream: (camId: string) => void;
  toggleDarshanEnabled: (enabled: boolean) => void;

  // 8. Gallery
  galleryData: GalleryData;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'views'>) => void;
  deleteGalleryItem: (id: string) => void;

  // 9. Broadcasts
  broadcasts: BroadcastMessage[];
  addBroadcast: (message: string, priority: BroadcastMessage['priority'], targetChannels: string[]) => void;
  toggleBroadcast: (id: string) => void;
  deleteBroadcast: (id: string) => void;

  // 10. Operational Settings
  settings: FestivalSettings;
  updateSettings: (updates: Partial<FestivalSettings>) => void;

  // 11. Devotee Seva Offering (Private to devotee receipt, without exposing communal finance)
  recordDevoteeSevaOffering: (donorName: string, amount: number, sevaType: string, village?: string, paymentMethod?: 'UPI' | 'HAND CASH' | 'BANK NEFT') => DonationRecord;

  // 12. Admin Finance (Strictly Private to authenticated Admin)
  adminFinance: FinanceSummary;
  addAdminDonationRecord: (record: Omit<DonationRecord, 'id' | 'txnId' | 'timestamp'>) => DonationRecord;
  verifyAdminDonationRecord: (id: string) => void;

  // 13. System Export & Backup
  exportAllJSON: () => Record<string, unknown>;
  resetToDefaultJSON: () => void;

  // Audio Utilities
  isChantPlaying: boolean;
  activeChantIndex: number;
  togglePlayChant: () => void;
  nextChant: () => void;
  prevChant: () => void;
  currentChant: { title: string; subtitle: string; duration: string };
  playTempleBell: (pitchMultiplier?: number) => void;
  playAartiAlert: () => void;
  isAudioMuted: boolean;
  toggleMute: () => boolean;
}

const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

const CHANT_PLAYLIST = [
  {
    title: 'Vinayaka Bhakti Geethalu',
    subtitle: 'Maha Ganapathi Manasa Smarami & Nadaswaram recital',
    duration: '22:00',
  },
  {
    title: 'Ganesha Atharvashirsha Upanishad',
    subtitle: 'Traditional Vedic Ghanapatha Chanting',
    duration: '18:45',
  },
  {
    title: 'Sankata Nashana Ganesha Stotram',
    subtitle: 'Narada Purana Devotional Stotra with Tanpura',
    duration: '14:20',
  },
  {
    title: 'Vatapi Ganapatim Bhajeham',
    subtitle: 'Carnatic Hamsadhwani Classical Symphony',
    duration: '16:30',
  },
];

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Festival Metadata
  const [festivalInfo, setFestivalInfo] = useState<FestivalConfig>(() => dataService.getFestival());

  // 2. Schedule & Rituals
  const [events, setEvents] = useState<DayItinerary[]>(() => dataService.getEvents());

  // 3. Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => dataService.getAnnouncements());

  // 4. Prasad
  const [prasadItems, setPrasadItems] = useState<PrasadItem[]>(() => dataService.getPrasad());
  const [bookedTokens, setBookedTokens] = useState<PrasadToken[]>(() => {
    try {
      const saved = localStorage.getItem('svm_tokens');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Competitions
  const [competitions, setCompetitions] = useState<Competition[]>(() => dataService.getCompetitions());
  const [registeredParticipants, setRegisteredParticipants] = useState<CompetitionRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('svm_comp_regs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Sports
  const [sportsData, setSportsData] = useState<SportsData>(() => dataService.getSports());

  // 7. Live Darshan
  const [darshanConfig, setDarshanConfig] = useState<LiveDarshanConfig>(() => dataService.getDarshan());
  const [activeCamera, setActiveCamera] = useState<string>(darshanConfig.activeCameraId || 'cam-1');

  // 8. Gallery
  const [galleryData, setGalleryData] = useState<GalleryData>(() => dataService.getGallery());

  // 9. Broadcasts
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(() => dataService.getBroadcasts());

  // 10. Settings
  const [settings, setSettings] = useState<FestivalSettings>(() => dataService.getSettings());

  // 11. Admin Finance (Admin-only storage)
  const [adminFinance, setAdminFinance] = useState<FinanceSummary>(() => dataService.getFinance());

  // Audio player state
  const [isChantPlaying, setIsChantPlaying] = useState(false);
  const [activeChantIndex, setActiveChantIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Sync token and registration lists
  useEffect(() => {
    try {
      localStorage.setItem('svm_tokens', JSON.stringify(bookedTokens));
    } catch {}
  }, [bookedTokens]);

  useEffect(() => {
    try {
      localStorage.setItem('svm_comp_regs', JSON.stringify(registeredParticipants));
    } catch {}
  }, [registeredParticipants]);

  // 1. Festival info updater
  const updateFestivalConfig = useCallback((updates: Partial<FestivalConfig>) => {
    setFestivalInfo((prev) => {
      const updated = { ...prev, ...updates };
      dataService.saveFestival(updated);
      return updated;
    });
  }, []);

  // 2. Schedule updaters
  const updateRitualStatus = useCallback((dayNumber: number, ritualId: string, status: Ritual['status']) => {
    setEvents((prev) => {
      const updated = prev.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          rituals: day.rituals.map((r) => (r.id === ritualId ? { ...r, status } : r)),
        };
      });
      dataService.saveEvents(updated);
      return updated;
    });
  }, []);

  const updateDayItinerary = useCallback((dayNumber: number, updates: Partial<DayItinerary>) => {
    setEvents((prev) => {
      const updated = prev.map((day) => (day.dayNumber === dayNumber ? { ...day, ...updates } : day));
      dataService.saveEvents(updated);
      return updated;
    });
  }, []);

  const addDayItinerary = useCallback((newDay: DayItinerary) => {
    setEvents((prev) => {
      const updated = [...prev, newDay].sort((a, b) => a.dayNumber - b.dayNumber);
      dataService.saveEvents(updated);
      return updated;
    });
  }, []);

  const deleteDayItinerary = useCallback((dayNumber: number) => {
    setEvents((prev) => {
      const updated = prev.filter((d) => d.dayNumber !== dayNumber);
      dataService.saveEvents(updated);
      return updated;
    });
  }, []);

  // 3. Announcements updaters
  const addAnnouncement = useCallback((item: Omit<Announcement, 'id' | 'timestamp'>) => {
    setAnnouncements((prev) => {
      const newAnn: Announcement = {
        ...item,
        id: `ann-${Date.now()}`,
        timestamp: 'Just now',
        published: true,
        isActive: true,
      };
      const updated = [newAnn, ...prev];
      dataService.saveAnnouncements(updated);
      return updated;
    });

    if (item.priority === 'urgent' || item.priority === 'emergency') {
      templeAudio.playAartiChime();
    } else {
      templeAudio.playTempleBell();
    }
  }, []);

  const updateAnnouncement = useCallback((id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      dataService.saveAnnouncements(updated);
      return updated;
    });
  }, []);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      dataService.saveAnnouncements(updated);
      return updated;
    });
  }, []);

  const toggleAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, published: !(a.published ?? a.isActive), isActive: !(a.isActive ?? a.published) } : a));
      dataService.saveAnnouncements(updated);
      return updated;
    });
  }, []);

  // 4. Prasad updaters
  const bookPrasad = useCallback((itemId: string, quantity: number, devoteeName: string, phone: string): PrasadToken => {
    const targetItem = prasadItems.find((p) => p.id === itemId);
    const itemName = targetItem ? targetItem.name : 'Maha Prasadam';
    const price = targetItem ? targetItem.price : 101;
    const totalAmount = price * quantity;

    setPrasadItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, availableCount: Math.max(0, item.availableCount - quantity) } : item
      );
      dataService.savePrasad(updated);
      return updated;
    });

    const token: PrasadToken = {
      tokenId: `SKL-PRASAD-${Date.now().toString().slice(-4)}`,
      devoteeName,
      phone,
      itemName,
      quantity,
      totalAmount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pickupCounter: targetItem?.pickupCounter || 'Mandapam West Counter #03',
      status: 'Ready',
    };

    setBookedTokens((prev) => [token, ...prev]);

    // Record into private admin finance quietly
    const newRecord: DonationRecord = {
      id: `don-${Date.now()}`,
      txnId: `TXN-${Date.now().toString().slice(-5)}`,
      donorName: devoteeName,
      village: 'Srikolanu',
      sevaType: `Prasad Booking: ${itemName} (${quantity})`,
      paymentMethod: 'UPI',
      amount: totalAmount,
      status: 'Verified',
      timestamp: new Date().toLocaleString('en-IN'),
    };
    setAdminFinance((prev) => {
      const updated: FinanceSummary = {
        ...prev,
        totalCollected: prev.totalCollected + totalAmount,
        verifiedCount: prev.verifiedCount + 1,
        summary: {
          ...prev.summary,
          upiTotal: prev.summary.upiTotal + totalAmount,
        },
        records: [newRecord, ...prev.records],
      };
      dataService.saveFinance(updated);
      return updated;
    });

    templeAudio.playTempleBell(1.1);
    return token;
  }, [prasadItems]);

  const updatePrasadItem = useCallback((id: string, updates: Partial<PrasadItem>) => {
    setPrasadItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      dataService.savePrasad(updated);
      return updated;
    });
  }, []);

  const addPrasadItem = useCallback((item: Omit<PrasadItem, 'id'>) => {
    setPrasadItems((prev) => {
      const newItem: PrasadItem = { ...item, id: `prs-${Date.now()}` };
      const updated = [...prev, newItem];
      dataService.savePrasad(updated);
      return updated;
    });
  }, []);

  const deletePrasadItem = useCallback((id: string) => {
    setPrasadItems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      dataService.savePrasad(updated);
      return updated;
    });
  }, []);

  // 5. Competitions updaters
  const registerForCompetition = useCallback((
    compId: string,
    participantName: string,
    phone: string,
    wardStreet: string,
    category: string
  ): CompetitionRegistration => {
    const comp = competitions.find((c) => c.id === compId);
    const reg: CompetitionRegistration = {
      regId: `REG-SKL-${Date.now().toString().slice(-5)}`,
      competitionName: comp ? comp.name : 'Festival Competition',
      category,
      participantName,
      phone,
      wardStreet,
      registeredAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setRegisteredParticipants((prev) => [reg, ...prev]);
    setCompetitions((prev) => {
      const updated = prev.map((c) => (c.id === compId ? { ...c, registeredCount: c.registeredCount + 1 } : c));
      dataService.saveCompetitions(updated);
      return updated;
    });

    templeAudio.playTempleBell();
    return reg;
  }, [competitions]);

  const addCompetition = useCallback((comp: Omit<Competition, 'id' | 'registeredCount'>) => {
    setCompetitions((prev) => {
      const newComp: Competition = { ...comp, id: `comp-${Date.now()}`, registeredCount: 0, status: 'open' };
      const updated = [...prev, newComp];
      dataService.saveCompetitions(updated);
      return updated;
    });
  }, []);

  const updateCompetition = useCallback((id: string, updates: Partial<Competition>) => {
    setCompetitions((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      dataService.saveCompetitions(updated);
      return updated;
    });
  }, []);

  const deleteCompetition = useCallback((id: string) => {
    setCompetitions((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      dataService.saveCompetitions(updated);
      return updated;
    });
  }, []);

  // 6. Sports updaters
  const updateLiveMatchScore = useCallback((
    team1Score: number,
    team2Score: number,
    team1?: string,
    team2?: string,
    status?: string
  ) => {
    setSportsData((prev) => {
      const updated: SportsData = {
        ...prev,
        liveMatch: {
          ...prev.liveMatch,
          team1: team1 || prev.liveMatch.team1,
          team2: team2 || prev.liveMatch.team2,
          team1Score,
          team2Score,
          status: status || prev.liveMatch.status,
          lastUpdated: 'Just now',
        },
      };
      dataService.saveSports(updated);
      return updated;
    });
  }, []);

  const updateLeaderboardScore = useCallback((teamName: string, points: number, matchStatus?: string) => {
    setSportsData((prev) => {
      const updatedLeaderboard = prev.leaderboard.map((t) =>
        t.teamName === teamName ? { ...t, points, matchStatus: matchStatus || t.matchStatus } : t
      );
      updatedLeaderboard.sort((a, b) => b.points - a.points);
      const ranked = updatedLeaderboard.map((t, idx) => ({ ...t, rank: idx + 1 }));
      const updated: SportsData = { ...prev, leaderboard: ranked };
      dataService.saveSports(updated);
      return updated;
    });
  }, []);

  // 7. Live Darshan updaters
  const updateCameraStream = useCallback((camId: string, updates: Partial<CameraStream>) => {
    setDarshanConfig((prev) => {
      const updatedCameras = prev.cameras.map((c) => (c.id === camId ? { ...c, ...updates } : c));
      const updated: LiveDarshanConfig = { ...prev, cameras: updatedCameras };
      dataService.saveDarshan(updated);
      return updated;
    });
  }, []);

  const addCameraStream = useCallback((camera: Omit<CameraStream, 'id'>) => {
    setDarshanConfig((prev) => {
      const newCam: CameraStream = {
        ...camera,
        id: `cam-${Date.now()}`,
      };
      const updated: LiveDarshanConfig = { ...prev, cameras: [...prev.cameras, newCam] };
      dataService.saveDarshan(updated);
      return updated;
    });
  }, []);

  const deleteCameraStream = useCallback((camId: string) => {
    setDarshanConfig((prev) => {
      const updated: LiveDarshanConfig = { ...prev, cameras: prev.cameras.filter((c) => c.id !== camId) };
      dataService.saveDarshan(updated);
      return updated;
    });
  }, []);

  const toggleDarshanEnabled = useCallback((enabled: boolean) => {
    setDarshanConfig((prev) => {
      const updated: LiveDarshanConfig = { ...prev, enabled };
      dataService.saveDarshan(updated);
      return updated;
    });
  }, []);

  // 8. Gallery updaters
  const addGalleryItem = useCallback((item: Omit<GalleryItem, 'id' | 'views'>) => {
    setGalleryData((prev) => {
      const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}`, views: 100 };
      const updated: GalleryData = { ...prev, moments: [newItem, ...prev.moments] };
      dataService.saveGallery(updated);
      return updated;
    });
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setGalleryData((prev) => {
      const updated: GalleryData = { ...prev, moments: prev.moments.filter((m) => m.id !== id) };
      dataService.saveGallery(updated);
      return updated;
    });
  }, []);

  // 9. Broadcast updaters
  const addBroadcast = useCallback((message: string, priority: BroadcastMessage['priority'], targetChannels: string[]) => {
    setBroadcasts((prev) => {
      const newBc: BroadcastMessage = {
        id: `bc-${Date.now()}`,
        message,
        priority,
        createdAt: new Date().toLocaleString('en-IN'),
        active: true,
        targetChannels,
      };
      const updated = [newBc, ...prev];
      dataService.saveBroadcasts(updated);
      return updated;
    });
  }, []);

  const toggleBroadcast = useCallback((id: string) => {
    setBroadcasts((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
      dataService.saveBroadcasts(updated);
      return updated;
    });
  }, []);

  const deleteBroadcast = useCallback((id: string) => {
    setBroadcasts((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      dataService.saveBroadcasts(updated);
      return updated;
    });
  }, []);

  // 10. Settings updater
  const updateSettings = useCallback((updates: Partial<FestivalSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      dataService.saveSettings(updated);
      return updated;
    });
  }, []);

  // 11. Devotee Seva Offering (Strictly individual receipt without disclosing communal funding)
  const recordDevoteeSevaOffering = useCallback((
    donorName: string,
    amount: number,
    sevaType: string,
    village = 'Srikolanu',
    paymentMethod: 'UPI' | 'HAND CASH' | 'BANK NEFT' = 'UPI'
  ): DonationRecord => {
    const record: DonationRecord = {
      id: `don-${Date.now()}`,
      txnId: `TXN-${Date.now().toString().slice(-5)}`,
      donorName,
      village,
      sevaType,
      paymentMethod,
      amount,
      status: 'Verified',
      timestamp: new Date().toLocaleString('en-IN'),
    };

    // Keep exclusively in private admin finance
    setAdminFinance((prev) => {
      const updated: FinanceSummary = {
        ...prev,
        totalCollected: prev.totalCollected + amount,
        verifiedCount: prev.verifiedCount + 1,
        summary: {
          ...prev.summary,
          cashTotal: paymentMethod === 'HAND CASH' ? prev.summary.cashTotal + amount : prev.summary.cashTotal,
          upiTotal: paymentMethod === 'UPI' ? prev.summary.upiTotal + amount : prev.summary.upiTotal,
          bankNeftTotal: paymentMethod === 'BANK NEFT' ? prev.summary.bankNeftTotal + amount : prev.summary.bankNeftTotal,
        },
        records: [record, ...prev.records],
      };
      dataService.saveFinance(updated);
      return updated;
    });

    return record;
  }, []);

  // 12. Admin Finance methods (Private)
  const addAdminDonationRecord = useCallback((record: Omit<DonationRecord, 'id' | 'txnId' | 'timestamp'>): DonationRecord => {
    const newRec: DonationRecord = {
      ...record,
      id: `don-${Date.now()}`,
      txnId: `TXN-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleString('en-IN'),
    };

    setAdminFinance((prev) => {
      const updated: FinanceSummary = {
        ...prev,
        totalCollected: prev.totalCollected + record.amount,
        verifiedCount: prev.verifiedCount + 1,
        summary: {
          ...prev.summary,
          cashTotal: record.paymentMethod === 'HAND CASH' ? prev.summary.cashTotal + record.amount : prev.summary.cashTotal,
          upiTotal: record.paymentMethod === 'UPI' ? prev.summary.upiTotal + record.amount : prev.summary.upiTotal,
          bankNeftTotal: record.paymentMethod === 'BANK NEFT' ? prev.summary.bankNeftTotal + record.amount : prev.summary.bankNeftTotal,
        },
        records: [newRec, ...prev.records],
      };
      dataService.saveFinance(updated);
      return updated;
    });

    return newRec;
  }, []);

  const verifyAdminDonationRecord = useCallback((id: string) => {
    setAdminFinance((prev) => {
      const updatedRecords = prev.records.map((r) => (r.id === id ? { ...r, status: 'Verified' as const } : r));
      const updated: FinanceSummary = { ...prev, records: updatedRecords };
      dataService.saveFinance(updated);
      return updated;
    });
  }, []);

  // 13. System Export & Backup
  const exportAllJSON = useCallback(() => {
    return dataService.exportAllData();
  }, []);

  const resetToDefaultJSON = useCallback(() => {
    dataService.resetToDefaults();
    setFestivalInfo(dataService.getFestival());
    setEvents(dataService.getEvents());
    setAnnouncements(dataService.getAnnouncements());
    setPrasadItems(dataService.getPrasad());
    setCompetitions(dataService.getCompetitions());
    setSportsData(dataService.getSports());
    setDarshanConfig(dataService.getDarshan());
    setGalleryData(dataService.getGallery());
    setBroadcasts(dataService.getBroadcasts());
    setSettings(dataService.getSettings());
    setAdminFinance(dataService.getFinance());
  }, []);

  // Audio Chants
  const currentChant = CHANT_PLAYLIST[activeChantIndex];

  const togglePlayChant = () => {
    if (!isChantPlaying) {
      templeAudio.playAartiChime();
    }
    setIsChantPlaying(!isChantPlaying);
  };

  const nextChant = () => {
    setActiveChantIndex((prev) => (prev + 1) % CHANT_PLAYLIST.length);
    templeAudio.playTempleBell(1.1);
  };

  const prevChant = () => {
    setActiveChantIndex((prev) => (prev - 1 + CHANT_PLAYLIST.length) % CHANT_PLAYLIST.length);
    templeAudio.playTempleBell(0.9);
  };

  const toggleMute = () => {
    const muted = templeAudio.toggleMute();
    setIsAudioMuted(muted);
    return muted;
  };

  const playTempleBell = (pitch = 1.0) => templeAudio.playTempleBell(pitch);
  const playAartiAlert = () => templeAudio.playAartiChime();

  return (
    <FestivalContext.Provider
      value={{
        festivalInfo,
        updateFestivalConfig,
        events,
        updateRitualStatus,
        updateDayItinerary,
        addDayItinerary,
        deleteDayItinerary,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncement,
        prasadItems,
        bookedTokens,
        bookPrasad,
        updatePrasadItem,
        addPrasadItem,
        deletePrasadItem,
        competitions,
        registeredParticipants,
        registerForCompetition,
        addCompetition,
        updateCompetition,
        deleteCompetition,
        sportsData,
        leaderboard: sportsData?.leaderboard || [],
        liveMatch: sportsData?.liveMatch,
        updateLiveMatchScore,
        updateLeaderboardScore,
        darshanConfig,
        liveStreamWatching: darshanConfig?.activeViewers || 4280,
        activeCamera,
        setActiveCamera,
        updateCameraStream,
        addCameraStream,
        deleteCameraStream,
        toggleDarshanEnabled,
        galleryData,
        addGalleryItem,
        deleteGalleryItem,
        broadcasts,
        addBroadcast,
        toggleBroadcast,
        deleteBroadcast,
        settings,
        updateSettings,
        recordDevoteeSevaOffering,
        adminFinance,
        addAdminDonationRecord,
        verifyAdminDonationRecord,
        exportAllJSON,
        resetToDefaultJSON,
        isChantPlaying,
        activeChantIndex,
        togglePlayChant,
        nextChant,
        prevChant,
        currentChant,
        playTempleBell,
        playAartiAlert,
        isAudioMuted,
        toggleMute,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = () => {
  const context = useContext(FestivalContext);
  if (!context) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
};
