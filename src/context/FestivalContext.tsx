import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Announcement,
  CrowdStatus,
  PrasadItem,
  LeaderboardEntry,
  Competition,
  DonationRecord,
  GalleryItem,
} from '../types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CROWD_STATUS,
  INITIAL_PRASAD_ITEMS,
  INITIAL_LEADERBOARD,
  INITIAL_COMPETITIONS,
  INITIAL_DONATIONS,
  GALLERY_MOMENTS,
} from '../data/festivalData';
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

export interface LiveMatchScore {
  team1: string;
  team1Score: number;
  team2: string;
  team2Score: number;
  half: string; // "2nd Half: 14:22"
  court: string;
  lastUpdatedBy: string;
}

interface WebhookLog {
  id: string;
  timestamp: string;
  channel: 'WhatsApp' | 'Telegram' | 'Pandal LED' | 'Website SSE';
  payload: string;
  status: 'Sent' | 'Delivered';
}

interface FestivalContextType {
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncement: (id: string) => void;

  // Crowd & Queue
  crowdStatus: CrowdStatus;
  updateCrowdStatus: (updates: Partial<CrowdStatus>) => void;

  // Prasad
  prasadItems: PrasadItem[];
  bookedTokens: PrasadToken[];
  bookPrasad: (itemId: string, quantity: number, devoteeName: string, phone: string) => PrasadToken;

  // Leaderboard & Live Sports
  leaderboard: LeaderboardEntry[];
  liveMatch: LiveMatchScore;
  updateLiveMatchScore: (team1Score: number, team2Score: number, team1?: string, team2?: string) => void;
  updateLeaderboardScore: (teamName: string, points: number, matchStatus?: string) => void;

  // Competitions
  competitions: Competition[];
  registeredParticipants: CompetitionRegistration[];
  registerForCompetition: (compId: string, participantName: string, phone: string, wardStreet: string, category: string) => CompetitionRegistration;

  // Donations & Seva
  donations: DonationRecord[];
  addDonation: (donorName: string, amount: number, sevaType: string, village?: string, paymentMethod?: 'UPI' | 'HAND CASH' | 'BANK NEFT') => DonationRecord;
  totalDonations: number;

  // Gallery
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'views'>) => void;

  // Live Stream & Stats
  liveStreamWatching: number;
  activeCamera: string;
  setActiveCamera: (camId: string) => void;
  liveVisitors: number;

  // Audio & Sanctum Chants
  isChantPlaying: boolean;
  activeChantIndex: number;
  togglePlayChant: () => void;
  nextChant: () => void;
  prevChant: () => void;
  currentChant: { title: string; subtitle: string; duration: string };

  // Webhooks & n8n
  webhookLogs: WebhookLog[];
  triggerBroadcastWebhook: (message: string, priority: string, channels: string[]) => void;

  // Audio bells
  playTempleBell: () => void;
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
  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('sri_vinayaka_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Crowd Status
  const [crowdStatus, setCrowdStatus] = useState<CrowdStatus>(() => {
    const saved = localStorage.getItem('sri_vinayaka_crowd');
    return saved ? JSON.parse(saved) : INITIAL_CROWD_STATUS;
  });

  // Prasad Items
  const [prasadItems, setPrasadItems] = useState<PrasadItem[]>(() => {
    const saved = localStorage.getItem('sri_vinayaka_prasad');
    return saved ? JSON.parse(saved) : INITIAL_PRASAD_ITEMS;
  });

  // Booked Prasad Tokens
  const [bookedTokens, setBookedTokens] = useState<PrasadToken[]>(() => {
    const saved = localStorage.getItem('sri_vinayaka_tokens');
    return saved ? JSON.parse(saved) : [];
  });

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('sri_vinayaka_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  // Live Kabaddi / Tournament match
  const [liveMatch, setLiveMatch] = useState<LiveMatchScore>(() => {
    const saved = localStorage.getItem('sri_vinayaka_live_match');
    return saved
      ? JSON.parse(saved)
      : {
          team1: 'Srikolanu Warriors',
          team1Score: 38,
          team2: 'Riverbank Titans',
          team2Score: 32,
          half: '2nd Half: 14:22',
          court: 'Court 1 • Kabaddi Finals',
          lastUpdatedBy: 'Ravi K. (Scorer)',
        };
  });

  // Competitions
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [registeredParticipants, setRegisteredParticipants] = useState<CompetitionRegistration[]>(() => {
    const saved = localStorage.getItem('sri_vinayaka_comp_regs');
    return saved ? JSON.parse(saved) : [];
  });

  // Donations
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('sri_vinayaka_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Gallery
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_MOMENTS);

  // Live Stats
  const [liveStreamWatching, setLiveStreamWatching] = useState(1842);
  const [liveVisitors, setLiveVisitors] = useState(342);
  const [activeCamera, setActiveCamera] = useState('cam-1');

  // Audio player
  const [isChantPlaying, setIsChantPlaying] = useState(false);
  const [activeChantIndex, setActiveChantIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Webhook Logs
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: 'log-1',
      timestamp: '18:30:12 IST',
      channel: 'WhatsApp',
      payload: '{"event": "aarti_reminder", "audience": "devotee_all", "countdown": "15m"}',
      status: 'Delivered',
    },
    {
      id: 'log-2',
      timestamp: '18:15:00 IST',
      channel: 'Pandal LED',
      payload: '{"led_id": "PANDAL_MAIN_LED_01", "text": "LADDU COUNTERS OPEN AT WEST"}',
      status: 'Delivered',
    },
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('sri_vinayaka_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_crowd', JSON.stringify(crowdStatus));
  }, [crowdStatus]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_prasad', JSON.stringify(prasadItems));
  }, [prasadItems]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_tokens', JSON.stringify(bookedTokens));
  }, [bookedTokens]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_live_match', JSON.stringify(liveMatch));
  }, [liveMatch]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_comp_regs', JSON.stringify(registeredParticipants));
  }, [registeredParticipants]);

  useEffect(() => {
    localStorage.setItem('sri_vinayaka_donations', JSON.stringify(donations));
  }, [donations]);

  // Gentle live stats drift for authentic feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStreamWatching((prev) => Math.max(1600, prev + (Math.floor(Math.random() * 9) - 4)));
      setLiveVisitors((prev) => Math.max(280, prev + (Math.floor(Math.random() * 7) - 3)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Announcements methods
  const addAnnouncement = (item: Omit<Announcement, 'id' | 'timestamp'>) => {
    const newAnn: Announcement = {
      ...item,
      id: `ann-${Date.now()}`,
      timestamp: 'Just now',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Trigger audio chime for urgent alerts
    if (item.priority === 'urgent' || item.priority === 'emergency') {
      templeAudio.playAartiChime();
    } else {
      templeAudio.playTempleBell();
    }

    // Trigger mock n8n webhook broadcast
    triggerBroadcastWebhook(item.text, item.priority, [
      item.pushToLED ? 'Pandal LED' : '',
      item.pushToWhatsApp ? 'WhatsApp' : '',
      'Website SSE',
    ].filter(Boolean));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  // Crowd
  const updateCrowdStatus = (updates: Partial<CrowdStatus>) => {
    setCrowdStatus((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: 'Just now',
    }));
  };

  // Prasad booking
  const bookPrasad = (itemId: string, quantity: number, devoteeName: string, phone: string): PrasadToken => {
    const targetItem = prasadItems.find((p) => p.id === itemId);
    const itemName = targetItem ? targetItem.name : 'Maha Prasadam';
    const price = targetItem ? targetItem.price : 101;
    const totalAmount = price * quantity;

    // Deduct count
    setPrasadItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, availableCount: Math.max(0, item.availableCount - quantity) } : item
      )
    );

    const token: PrasadToken = {
      tokenId: `SKL-PRASAD-${Math.floor(1000 + Math.random() * 9000)}`,
      devoteeName,
      phone,
      itemName,
      quantity,
      totalAmount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pickupCounter: 'Mandapam West Counter #03',
      status: 'Ready',
    };

    setBookedTokens((prev) => [token, ...prev]);

    // Also record donation
    addDonation(devoteeName, totalAmount, `Prasad Seva: ${itemName} (${quantity})`, 'Srikolanu', 'UPI');

    templeAudio.playTempleBell(1.2);
    return token;
  };

  // Match & Leaderboard
  const updateLiveMatchScore = (team1Score: number, team2Score: number, team1?: string, team2?: string) => {
    setLiveMatch((prev) => ({
      ...prev,
      team1: team1 || prev.team1,
      team2: team2 || prev.team2,
      team1Score,
      team2Score,
      lastUpdatedBy: 'Admin Ops Panel',
    }));

    // Update corresponding team in leaderboard if applicable
    const activeTeam = team1 || liveMatch.team1;
    setLeaderboard((prev) =>
      prev.map((t) => (t.teamName === activeTeam ? { ...t, points: team1Score * 10 } : t))
    );
  };

  const updateLeaderboardScore = (teamName: string, points: number, matchStatus?: string) => {
    setLeaderboard((prev) => {
      const updated = prev.map((t) =>
        t.teamName === teamName
          ? { ...t, points, matchStatus: matchStatus || t.matchStatus }
          : t
      );
      // sort descending by points
      return updated.sort((a, b) => b.points - a.points).map((t, idx) => ({ ...t, rank: idx + 1 }));
    });
  };

  // Competition registration
  const registerForCompetition = (
    compId: string,
    participantName: string,
    phone: string,
    wardStreet: string,
    category: string
  ): CompetitionRegistration => {
    const comp = competitions.find((c) => c.id === compId);
    const reg: CompetitionRegistration = {
      regId: `REG-SKL-${Math.floor(10000 + Math.random() * 90000)}`,
      competitionName: comp ? comp.name : 'Festival Competition',
      category,
      participantName,
      phone,
      wardStreet,
      registeredAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setRegisteredParticipants((prev) => [reg, ...prev]);
    setCompetitions((prev) =>
      prev.map((c) => (c.id === compId ? { ...c, registeredCount: c.registeredCount + 1 } : c))
    );

    templeAudio.playTempleBell();
    return reg;
  };

  // Donations
  const addDonation = (
    donorName: string,
    amount: number,
    sevaType: string,
    village = 'Srikolanu',
    paymentMethod: 'UPI' | 'HAND CASH' | 'BANK NEFT' = 'UPI'
  ): DonationRecord => {
    const newRecord: DonationRecord = {
      id: `don-${Date.now()}`,
      txnId: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      donorName,
      village,
      sevaType,
      paymentMethod,
      amount,
      status: 'Verified',
      timestamp: 'Just now',
    };
    setDonations((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'views'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      views: 120,
    };
    setGalleryItems((prev) => [newItem, ...prev]);
  };

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

  const playTempleBell = () => templeAudio.playTempleBell();
  const playAartiAlert = () => templeAudio.playAartiChime();

  // n8n Webhook Simulator
  const triggerBroadcastWebhook = (message: string, priority: string, channels: string[]) => {
    const newLogs: WebhookLog[] = channels.map((channel, i) => ({
      id: `log-${Date.now()}-${i}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
      channel: channel as WebhookLog['channel'],
      payload: JSON.stringify({
        source: 'srikolanu_ganesh_committee',
        priority,
        message,
        dispatchedAt: new Date().toISOString(),
      }),
      status: 'Sent',
    }));

    setWebhookLogs((prev) => [...newLogs, ...prev.slice(0, 10)]);
  };

  return (
    <FestivalContext.Provider
      value={{
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        toggleAnnouncement,
        crowdStatus,
        updateCrowdStatus,
        prasadItems,
        bookedTokens,
        bookPrasad,
        leaderboard,
        liveMatch,
        updateLiveMatchScore,
        updateLeaderboardScore,
        competitions,
        registeredParticipants,
        registerForCompetition,
        donations,
        addDonation,
        totalDonations,
        galleryItems,
        addGalleryItem,
        liveStreamWatching,
        activeCamera,
        setActiveCamera,
        liveVisitors,
        isChantPlaying,
        activeChantIndex,
        togglePlayChant,
        nextChant,
        prevChant,
        currentChant,
        webhookLogs,
        triggerBroadcastWebhook,
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
