export interface Announcement {
  id: string;
  text: string;
  priority: 'normal' | 'urgent' | 'emergency';
  timestamp: string;
  isActive: boolean;
  pushToLED: boolean;
  pushToWhatsApp: boolean;
}

export interface Ritual {
  id: string;
  time: string;
  period: string; // 'PRATAH KAALA', 'MADHYAHNA', etc.
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
}

export interface CrowdStatus {
  currentWaitMinutes: number;
  gate1Status: string; // e.g. "Moving Smoothly"
  gate2Status: string; // e.g. "5 Min Wait (Assisted)"
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
  matchStatus: string; // '● Live Court 1', 'Final', 'Under Review'
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
  headSculptor: string;
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
  year: string;
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
