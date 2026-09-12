export interface Announcement {
  id: string;
  text: string;
  priority: 'normal' | 'urgent' | 'emergency';
  timestamp: string;
  isActive?: boolean;
  published?: boolean;
  pushToLED?: boolean;
  pushToWhatsApp?: boolean;
}

export interface Ritual {
  id: string;
  time: string;
  period: string; // 'MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'YATRA'
  title: string;
  description: string;
  venue: string;
  tag?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  isLiveStreamed?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  subtitle: string;
  muhurtham?: string;
  rituals: Ritual[];
}

export interface PrasadItem {
  id: string;
  name: string;
  price: number;
  availableCount: number;
  description: string;
  unit: string;
  pickupCounter?: string;
  pickupTiming?: string;
  status?: 'available' | 'sold_out' | 'limited';
  bookingLimitPerDevotee?: number;
}

export interface CrowdStatus {
  currentWaitMinutes: number;
  gate1Status: string;
  gate2Status: string;
  crowdDensity: 'Low' | 'Moderate' | 'High' | 'Peak';
  lastUpdated: string;
  peakExpectedTime: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  wardStreet: string;
  category: string;
  matchesPlayed: number;
  matchesWon: number;
  points: number;
  matchStatus: string;
  rewardTier: string;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  prizePool: string;
  firstPrize: string;
  secondPrize?: string;
  thirdPrize?: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  jury: string;
  registeredCount: number;
  status?: 'open' | 'closed' | 'in_progress';
}

export interface DonationRecord {
  id: string;
  txnId: string;
  donorName: string;
  village: string;
  sevaType: string;
  paymentMethod: 'UPI' | 'HAND CASH' | 'BANK NEFT';
  amount: number;
  status: 'Verified' | 'Pending';
  timestamp: string;
}

export interface HistoricalVaultItem {
  id: string;
  year: number;
  themeTitle: string;
  description: string;
  idolHeight: string;
  mandapamStyle: string;
  headSculptor?: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'aarti' | 'mandapam' | 'cultural' | 'prasadam' | 'procession' | 'achievements';
  timeTag: string;
  views: number;
  photoCount: number;
  imageUrl: string;
  is4k?: boolean;
}

export interface AchievementRecord {
  id: string;
  title: string;
  awardHonor: string;
  year: string | number;
  team: string;
  description: string;
  keyHighlight: string;
  imageUrl: string;
  tags: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  subtitle: string;
  sevaSponsored: string;
  tier: 'Maha Raja Poshakulu' | 'Raja Poshakulu' | 'Seva Daathalu';
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  yearsOfSeva: number;
  responsibility: string;
  phone: string;
  badge: string;
  avatarUrl: string;
}

export interface MythStory {
  id: string;
  title: string;
  subtitle: string;
  khanda: string;
  content: string;
  shloka: string;
  shlokaMeaning: string;
  imageUrl: string;
}

export interface FestivalConfig {
  name: string;
  tagline: string;
  colonyName: string;
  year: number;
  dates: string;
  tithi: string;
  venue: string;
  organizer: string;
  establishedYear: number;
  status: string;
  contacts: {
    helpline: string;
    altPhone: string;
    email: string;
    whatsapp: string;
  };
  socials: {
    youtube: string;
    instagram: string;
    facebook: string;
  };
  highlights: {
    unbrokenYears: number;
    annadanamMeals: string;
    ecoClayCommitment: string;
    expectedPilgrims: string;
  };
}

export interface CameraStream {
  id: string;
  name: string;
  label: string;
  streamUrl: string;
  badge: string;
  status: 'active' | 'offline' | 'maintenance';
  order: number;
}

export interface LiveDarshanConfig {
  enabled: boolean;
  templeState: string;
  activeCameraId: string;
  cameras: CameraStream[];
}

export interface BroadcastMessage {
  id: string;
  message: string;
  priority: 'normal' | 'urgent' | 'emergency';
  createdAt: string;
  active: boolean;
  targetChannels: string[];
}

export interface FestivalSettings {
  festivalStatus: string;
  maintenanceMode: boolean;
  enableLiveDarshan: boolean;
  enablePrasadBooking: boolean;
  enableCompetitions: boolean;
  enableSportsScoreboard: boolean;
  enableAnnouncementsTicker: boolean;
  enablePublicDonationAction: boolean;
  aartiTimes: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  helpline: string;
  emergencyAddress: string;
}

export interface FinanceSummary {
  currency: string;
  totalCollected: number;
  verifiedCount: number;
  summary: {
    cashTotal: number;
    upiTotal: number;
    bankNeftTotal: number;
  };
  records: DonationRecord[];
}

