import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Megaphone,
  Radio,
  Utensils,
  Trophy,
  Dumbbell,
  Video,
  Image as ImageIcon,
  IndianRupee,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  LogOut,
  Save,
  Check,
  Shield,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import { DayItinerary, Ritual, Announcement, PrasadItem, Competition, CameraStream } from '../types';

interface AdminPageProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'festival'
  | 'schedule'
  | 'announcements'
  | 'broadcast'
  | 'prasad'
  | 'competitions'
  | 'sports'
  | 'darshan'
  | 'gallery'
  | 'finance'
  | 'settings';

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout, onNavigateHome }) => {
  const {
    festivalInfo,
    updateFestivalConfig,
    events,
    updateRitualStatus,
    updateDayItinerary,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncement,
    prasadItems,
    updatePrasadItem,
    addPrasadItem,
    deletePrasadItem,
    competitions,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    sportsData,
    updateLiveMatchScore,
    updateLeaderboardScore,
    darshanConfig,
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
    adminFinance,
    addAdminDonationRecord,
    verifyAdminDonationRecord,
    exportAllJSON,
    resetToDefaultJSON,
  } = useFestival();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Local form states
  // 1. Festival info form
  const [festivalForm, setFestivalForm] = useState(festivalInfo);

  // 2. New Announcement form
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'urgent' | 'emergency'>('normal');

  // 3. New Broadcast form
  const [newBcMessage, setNewBcMessage] = useState('');
  const [newBcPriority, setNewBcPriority] = useState<'normal' | 'urgent' | 'emergency'>('urgent');
  const [newBcLED, setNewBcLED] = useState(true);
  const [newBcTicker, setNewBcTicker] = useState(true);

  // 4. New Prasad form
  const [newPrasadName, setNewPrasadName] = useState('');
  const [newPrasadPrice, setNewPrasadPrice] = useState(101);
  const [newPrasadCount, setNewPrasadCount] = useState(100);
  const [newPrasadUnit, setNewPrasadUnit] = useState('boxes');

  // 5. New Camera form
  const [newCamName, setNewCamName] = useState('');
  const [newCamLabel, setNewCamLabel] = useState('');
  const [newCamUrl, setNewCamUrl] = useState('');
  const [newCamBadge, setNewCamBadge] = useState('LIVE');

  // 6. New Finance Record form
  const [newFinDonor, setNewFinDonor] = useState('');
  const [newFinAmount, setNewFinAmount] = useState(1001);
  const [newFinSeva, setNewFinSeva] = useState('Maha Ganapathi Pooja Seva');
  const [newFinMethod, setNewFinMethod] = useState<'HAND CASH' | 'UPI' | 'BANK NEFT'>('HAND CASH');
  const [newFinVillage, setNewFinVillage] = useState('Srikolanu');

  // 7. Sports update form
  const [scoreTeam1, setScoreTeam1] = useState(sportsData.liveMatch.team1Score);
  const [scoreTeam2, setScoreTeam2] = useState(sportsData.liveMatch.team2Score);
  const [matchStatusText, setMatchStatusText] = useState(sportsData.liveMatch.status);

  // 8. New Competition form
  const [newCompName, setNewCompName] = useState('');
  const [newCompCat, setNewCompCat] = useState('Open Category');
  const [newCompDate, setNewCompDate] = useState('Day 05 • 11 Sept');
  const [newCompPrize, setNewCompPrize] = useState('₹10,000');
  const [newCompVenue, setNewCompVenue] = useState('Mandapam Dais');

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'festival', label: 'Festival Info', icon: <Shield className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule & Rituals', icon: <Calendar className="w-4 h-4" /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" />, badge: `${announcements.length}` },
    { id: 'broadcast', label: 'Broadcasting', icon: <Radio className="w-4 h-4" /> },
    { id: 'prasad', label: 'Prasad Inventory', icon: <Utensils className="w-4 h-4" /> },
    { id: 'competitions', label: 'Competitions', icon: <Trophy className="w-4 h-4" /> },
    { id: 'sports', label: 'Sports & Scores', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'darshan', label: 'Live Darshan', icon: <Video className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance (Private)', icon: <IndianRupee className="w-4 h-4 text-emerald-400" />, badge: 'Secret' },
    { id: 'settings', label: 'System Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const handleExportJSON = () => {
    const data = exportAllJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sri_vinayaka_festival_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported festival JSON backup successfully');
  };

  return (
    <div className="min-h-screen bg-[#0d0707] text-[#FFFDF5] pb-20">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#160a0a]/95 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#800000] border border-amber-400 flex items-center justify-center font-bold text-amber-300">
            🕉️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-base sm:text-lg text-amber-200">
                Festival Control Center
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                JSON STORE READY
              </span>
            </div>
            <p className="text-[11px] text-amber-200/60 hidden sm:block">
              Sri Vinayaka Mahotsavam • Executive Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-950/40 flex items-center gap-1.5 transition"
            title="Download full festival JSON configuration"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-500/20 text-amber-200/80 text-xs font-semibold hover:text-white hover:bg-black/60 transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold hover:bg-red-900/60 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-950 border-2 border-emerald-400 text-emerald-200 shadow-2xl flex items-center gap-2 animate-fade-in text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl temple-glass border border-amber-500/30 p-3 space-y-1 sticky top-24 shadow-xl">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-300/60">
                Operational Modules
              </div>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#800000] text-amber-200 border border-amber-400/50 shadow-md font-bold'
                        : 'text-amber-100/70 hover:text-white hover:bg-black/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        item.badge === 'Secret'
                          ? 'bg-red-950 text-red-300 border border-red-500/30'
                          : 'bg-black/40 text-amber-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Module Content */}
          <main className="lg:col-span-9 space-y-6">
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-amber-400">Control Center Status</span>
                      <h2 className="font-heading text-2xl font-bold text-[#FFFDF5]">{festivalInfo.name}</h2>
                      <p className="text-xs text-amber-200/70">{festivalInfo.tagline} • {festivalInfo.dates}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Operational Status: Online
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
                      <span className="text-xs text-amber-200/70">Scheduled Days</span>
                      <p className="font-heading text-2xl font-bold text-amber-300 mt-1">{events.length} Days</p>
                      <p className="text-[10px] text-amber-200/50 mt-1">{events.reduce((acc, d) => acc + d.rituals.length, 0)} Total Rituals</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
                      <span className="text-xs text-amber-200/70">Active Tickers</span>
                      <p className="font-heading text-2xl font-bold text-amber-300 mt-1">{announcements.filter(a => a.published ?? a.isActive).length}</p>
                      <p className="text-[10px] text-amber-200/50 mt-1">Live Announcements</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
                      <span className="text-xs text-amber-200/70">Prasad Varieties</span>
                      <p className="font-heading text-2xl font-bold text-amber-300 mt-1">{prasadItems.length}</p>
                      <p className="text-[10px] text-amber-200/50 mt-1">Active Offerings</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20">
                      <span className="text-xs text-amber-200/70">Darshan Cameras</span>
                      <p className="font-heading text-2xl font-bold text-amber-300 mt-1">{darshanConfig.cameras.length}</p>
                      <p className="text-[10px] text-amber-200/50 mt-1">{darshanConfig.enabled ? 'Streaming Enabled' : 'Offline'}</p>
                    </div>
                  </div>
                </div>

                {/* Today's Rituals Quick Overview */}
                <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-amber-200">
                      Day 01 Ritual Status (Fast Toggle)
                    </h3>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs text-amber-300 hover:underline"
                    >
                      Manage All 10 Days →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(events?.[0]?.rituals || []).map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400">{r.time}</span>
                            <span className="text-sm font-semibold text-white">{r.title}</span>
                          </div>
                          <p className="text-xs text-amber-200/60">{r.venue}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {(['upcoming', 'ongoing', 'completed'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                updateRitualStatus(1, r.id, st);
                                showToast(`Ritual status set to ${st}`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
                                r.status === st
                                  ? st === 'ongoing'
                                    ? 'bg-amber-400 text-black shadow-md'
                                    : st === 'completed'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-blue-900 text-white'
                                  : 'bg-black/30 text-amber-200/60 hover:bg-black/60'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. FESTIVAL CONFIGURATION */}
            {activeTab === 'festival' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Festival Core Details</h2>
                  <p className="text-xs text-amber-200/70">Modify global festival name, edition, dates, venue, and contact details.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateFestivalConfig(festivalForm);
                    showToast('Festival configuration updated');
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Festival Name</label>
                      <input
                        type="text"
                        value={festivalForm.name}
                        onChange={(e) => setFestivalForm({ ...festivalForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Tagline / Edition</label>
                      <input
                        type="text"
                        value={festivalForm.tagline}
                        onChange={(e) => setFestivalForm({ ...festivalForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Festival Year</label>
                      <input
                        type="number"
                        value={festivalForm.year}
                        onChange={(e) => setFestivalForm({ ...festivalForm, year: parseInt(e.target.value, 10) || 2026 })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Celebration Dates</label>
                      <input
                        type="text"
                        value={festivalForm.dates}
                        onChange={(e) => setFestivalForm({ ...festivalForm, dates: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Main Mandapam Venue</label>
                    <input
                      type="text"
                      value={festivalForm.venue}
                      onChange={(e) => setFestivalForm({ ...festivalForm, venue: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Organizing Committee</label>
                      <input
                        type="text"
                        value={festivalForm.organizer}
                        onChange={(e) => setFestivalForm({ ...festivalForm, organizer: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Helpline Phone</label>
                      <input
                        type="text"
                        value={festivalForm.contacts.helpline}
                        onChange={(e) => setFestivalForm({
                          ...festivalForm,
                          contacts: { ...festivalForm.contacts, helpline: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-heading font-bold text-sm hover:bg-amber-300 flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Festival Details</span>
                  </button>
                </form>
              </div>
            )}

            {/* 3. SCHEDULE & 10-DAY RITUALS */}
            {activeTab === 'schedule' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-amber-200">10-Day Festival Schedule</h2>
                    <p className="text-xs text-amber-200/70">Update ritual titles, timings, venues, and live statuses.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {events.map((day) => (
                    <div key={day.dayNumber} className="p-5 rounded-xl bg-black/40 border border-amber-500/20 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            Day {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber} • {day.date}
                          </span>
                          <h4 className="font-heading font-bold text-base text-white">{day.title}</h4>
                          <p className="text-xs text-amber-200/60">{day.subtitle}</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {day.rituals.map((r) => (
                          <div key={r.id} className="p-3 rounded-lg bg-black/50 border border-amber-500/15 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-[200px]">
                              <span className="text-xs font-mono font-bold text-amber-400 mr-2">{r.time}</span>
                              <span className="text-sm font-semibold text-amber-100">{r.title}</span>
                              <p className="text-[11px] text-amber-200/60">{r.venue}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {(['upcoming', 'ongoing', 'completed'] as const).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    updateRitualStatus(day.dayNumber, r.id, status);
                                    showToast(`Day ${day.dayNumber} ritual set to ${status}`);
                                  }}
                                  className={`px-2 py-1 rounded text-[11px] font-bold capitalize transition ${
                                    r.status === status
                                      ? status === 'ongoing'
                                        ? 'bg-amber-400 text-black'
                                        : status === 'completed'
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-blue-900 text-white'
                                      : 'bg-black/40 text-amber-200/50 hover:bg-black/80'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ANNOUNCEMENTS & LIVE TICKER */}
            {activeTab === 'announcements' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Live News Ticker & Announcements</h2>
                  <p className="text-xs text-amber-200/70">Create and toggle scrolling ticker bulletins for devotees.</p>
                </div>

                {/* Add new */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newAnnText.trim()) return;
                    addAnnouncement({
                      text: newAnnText.trim(),
                      priority: newAnnPriority,
                      published: true,
                      isActive: true,
                      pushToLED: true,
                      pushToWhatsApp: false,
                    });
                    setNewAnnText('');
                    showToast('New announcement published to live ticker');
                  }}
                  className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-3"
                >
                  <label className="block text-xs font-bold text-amber-300 uppercase">Create New Announcement</label>
                  <input
                    type="text"
                    required
                    value={newAnnText}
                    onChange={(e) => setNewAnnText(e.target.value)}
                    placeholder="e.g. 🪔 Maha Aarti starting in 10 minutes at Sanctum..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-amber-200">Priority:</span>
                      {(['normal', 'urgent', 'emergency'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewAnnPriority(p)}
                          className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition ${
                            newAnnPriority === p
                              ? p === 'emergency'
                                ? 'bg-red-600 text-white'
                                : p === 'urgent'
                                ? 'bg-amber-400 text-black'
                                : 'bg-blue-600 text-white'
                              : 'bg-black/50 text-amber-200/60'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Ticker</span>
                    </button>
                  </div>
                </form>

                {/* List */}
                <div className="space-y-3">
                  {announcements.map((ann) => {
                    const isPub = ann.published ?? ann.isActive ?? true;
                    return (
                      <div
                        key={ann.id}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                          isPub
                            ? 'bg-black/40 border-amber-500/30'
                            : 'bg-black/20 border-gray-800 opacity-60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                              ann.priority === 'emergency'
                                ? 'bg-red-950 text-red-300 border border-red-500'
                                : ann.priority === 'urgent'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500'
                                : 'bg-blue-950 text-blue-300 border border-blue-500'
                            }`}>
                              {ann.priority}
                            </span>
                            <span className="text-[11px] text-amber-200/60">{ann.timestamp}</span>
                            {!isPub && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-semibold">
                                Unpublished
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-amber-100 font-medium">{ann.text}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              toggleAnnouncement(ann.id);
                              showToast(`Announcement ${isPub ? 'hidden from' : 'published to'} ticker`);
                            }}
                            className={`p-2 rounded-lg text-xs font-bold transition ${
                              isPub ? 'bg-amber-950/60 text-amber-300 hover:bg-amber-900' : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
                            }`}
                            title={isPub ? 'Unpublish' : 'Publish'}
                          >
                            {isPub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              deleteAnnouncement(ann.id);
                              showToast('Announcement deleted');
                            }}
                            className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. BROADCASTING */}
            {activeTab === 'broadcast' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Emergency & Crowd Broadcasting</h2>
                  <p className="text-xs text-amber-200/70">Broadcast high-priority notices to website ticker and LED displays.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBcMessage.trim()) return;
                    const channels = [
                      newBcLED ? 'Pandal LED Screen' : '',
                      newBcTicker ? 'Website Ticker' : '',
                    ].filter(Boolean);
                    addBroadcast(newBcMessage.trim(), newBcPriority, channels);
                    setNewBcMessage('');
                    showToast('Broadcast alert logged and dispatched');
                  }}
                  className="p-5 rounded-xl bg-black/40 border border-amber-500/30 space-y-4"
                >
                  <label className="block text-xs font-bold text-amber-300 uppercase">Emergency Dispatch Message</label>
                  <textarea
                    rows={2}
                    required
                    value={newBcMessage}
                    onChange={(e) => setNewBcMessage(e.target.value)}
                    placeholder="Enter urgent broadcast for crowd or weather advisory..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-amber-300 uppercase mb-2">Priority</span>
                      <div className="flex items-center gap-2">
                        {(['normal', 'urgent', 'emergency'] as const).map((pr) => (
                          <button
                            key={pr}
                            type="button"
                            onClick={() => setNewBcPriority(pr)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                              newBcPriority === pr ? 'bg-amber-400 text-black' : 'bg-black/50 text-amber-200/60'
                            }`}
                          >
                            {pr}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-amber-300 uppercase mb-2">Target Displays</span>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newBcLED}
                            onChange={(e) => setNewBcLED(e.target.checked)}
                            className="accent-amber-400"
                          />
                          <span>Pandal LED Screen</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newBcTicker}
                            onChange={(e) => setNewBcTicker(e.target.checked)}
                            className="accent-amber-400"
                          />
                          <span>Website Ticker</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Dispatch Broadcast Alert</span>
                  </button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-amber-300/80">Broadcast History</h4>
                  {broadcasts.map((bc) => (
                    <div key={bc.id} className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 uppercase font-bold border border-red-500/30">
                            {bc.priority}
                          </span>
                          <span className="text-xs text-amber-200/60">{bc.createdAt}</span>
                          <span className="text-xs text-amber-300 font-mono">[{bc.targetChannels.join(', ')}]</span>
                        </div>
                        <p className="text-sm font-semibold text-white mt-1">{bc.message}</p>
                      </div>
                      <button
                        onClick={() => {
                          deleteBroadcast(bc.id);
                          showToast('Broadcast record removed');
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PRASAD INVENTORY */}
            {activeTab === 'prasad' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Prasad Inventory & Token Counters</h2>
                  <p className="text-xs text-amber-200/70">Manage available quantities, prices, and collection counters.</p>
                </div>

                {/* Add new prasad item */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPrasadName.trim()) return;
                    addPrasadItem({
                      name: newPrasadName.trim(),
                      price: newPrasadPrice,
                      availableCount: newPrasadCount,
                      unit: newPrasadUnit,
                      description: 'Fresh holy prasad consecrated in temple sanctum.',
                      pickupCounter: 'Mandapam West Counter #03',
                      status: 'available',
                    });
                    setNewPrasadName('');
                    showToast('New Prasad item added');
                  }}
                  className="p-4 rounded-xl bg-black/40 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Prasad Name</label>
                    <input
                      type="text"
                      required
                      value={newPrasadName}
                      onChange={(e) => setNewPrasadName(e.target.value)}
                      placeholder="e.g. Maha Bellam Kudumulu (4 pcs)"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newPrasadPrice}
                      onChange={(e) => setNewPrasadPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Available Count</label>
                    <input
                      type="number"
                      required
                      value={newPrasadCount}
                      onChange={(e) => setNewPrasadCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Prasad Item</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {prasadItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-black/40 border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="font-heading font-bold text-base text-white">{item.name}</h4>
                        <p className="text-xs text-amber-200/60">{item.description}</p>
                        <p className="text-[11px] text-amber-300 font-mono mt-1">
                          Price: ₹{item.price} • {item.pickupCounter || 'Counter #01'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-amber-200/60">Inventory</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                updatePrasadItem(item.id, { availableCount: Math.max(0, item.availableCount - 10) });
                                showToast('Inventory updated (-10)');
                              }}
                              className="w-6 h-6 rounded bg-black border border-amber-500/30 text-xs font-bold hover:bg-amber-950"
                            >
                              -
                            </button>
                            <span className="font-heading font-bold text-base text-amber-300 px-2">
                              {item.availableCount}
                            </span>
                            <button
                              onClick={() => {
                                updatePrasadItem(item.id, { availableCount: item.availableCount + 10 });
                                showToast('Inventory updated (+10)');
                              }}
                              className="w-6 h-6 rounded bg-black border border-amber-500/30 text-xs font-bold hover:bg-amber-950"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            deletePrasadItem(item.id);
                            showToast('Prasad item removed');
                          }}
                          className="p-2 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. COMPETITIONS */}
            {activeTab === 'competitions' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Cultural Competitions</h2>
                  <p className="text-xs text-amber-200/70">Manage Rangoli, singing, modak making, and kids sculpting contests.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCompName.trim()) return;
                    addCompetition({
                      name: newCompName.trim(),
                      category: newCompCat,
                      date: newCompDate,
                      prizePool: newCompPrize,
                      firstPrize: `${newCompPrize} Award`,
                      venue: newCompVenue,
                      time: '10:00 AM - 01:00 PM',
                      description: 'Village traditional festival contest celebrating devotion and creativity.',
                      jury: 'Colony Cultural Committee',
                    });
                    setNewCompName('');
                    showToast('Competition created');
                  }}
                  className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-3"
                >
                  <label className="block text-xs font-bold text-amber-300 uppercase">Add New Competition</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newCompName}
                      onChange={(e) => setNewCompName(e.target.value)}
                      placeholder="Competition Title"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={newCompCat}
                      onChange={(e) => setNewCompCat(e.target.value)}
                      placeholder="Category (e.g. Women / Youth)"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newCompDate}
                      onChange={(e) => setNewCompDate(e.target.value)}
                      placeholder="Date & Time"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={newCompPrize}
                      onChange={(e) => setNewCompPrize(e.target.value)}
                      placeholder="Prize Pool (e.g. ₹15,000)"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={newCompVenue}
                      onChange={(e) => setNewCompVenue(e.target.value)}
                      placeholder="Venue"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publish Contest</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {competitions.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-base text-white">{c.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                            {c.registeredCount} Registered
                          </span>
                        </div>
                        <p className="text-xs text-amber-200/60 mt-0.5">{c.date} • {c.venue} • Prize: {c.prizePool}</p>
                      </div>
                      <button
                        onClick={() => {
                          deleteCompetition(c.id);
                          showToast('Competition removed');
                        }}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. SPORTS & TOURNAMENTS */}
            {activeTab === 'sports' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Sports & Live Match Scoring</h2>
                  <p className="text-xs text-amber-200/70">Update Kabaddi, Volleyball, and tournament scores in real-time.</p>
                </div>

                {/* Live Match Scorer */}
                <div className="p-5 rounded-xl bg-black/40 border border-amber-500/30 space-y-4">
                  <span className="text-xs font-bold uppercase text-amber-400">Live Court Scoreboard</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20 text-center space-y-2">
                      <span className="text-sm font-bold text-amber-200">{sportsData.liveMatch.team1}</span>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            const newScore = Math.max(0, scoreTeam1 - 1);
                            setScoreTeam1(newScore);
                            updateLiveMatchScore(newScore, scoreTeam2);
                          }}
                          className="w-8 h-8 rounded bg-black border border-amber-500/40 font-bold"
                        >
                          -
                        </button>
                        <span className="font-heading text-3xl font-black text-amber-300">{scoreTeam1}</span>
                        <button
                          onClick={() => {
                            const newScore = scoreTeam1 + 1;
                            setScoreTeam1(newScore);
                            updateLiveMatchScore(newScore, scoreTeam2);
                          }}
                          className="w-8 h-8 rounded bg-black border border-amber-500/40 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20 text-center space-y-2">
                      <span className="text-sm font-bold text-amber-200">{sportsData.liveMatch.team2}</span>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            const newScore = Math.max(0, scoreTeam2 - 1);
                            setScoreTeam2(newScore);
                            updateLiveMatchScore(scoreTeam1, newScore);
                          }}
                          className="w-8 h-8 rounded bg-black border border-amber-500/40 font-bold"
                        >
                          -
                        </button>
                        <span className="font-heading text-3xl font-black text-amber-300">{scoreTeam2}</span>
                        <button
                          onClick={() => {
                            const newScore = scoreTeam2 + 1;
                            setScoreTeam2(newScore);
                            updateLiveMatchScore(scoreTeam1, newScore);
                          }}
                          className="w-8 h-8 rounded bg-black border border-amber-500/40 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <input
                      type="text"
                      value={matchStatusText}
                      onChange={(e) => setMatchStatusText(e.target.value)}
                      placeholder="Match Status (e.g. 2nd Half: 14:22)"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400 grow"
                    />
                    <button
                      onClick={() => {
                        updateLiveMatchScore(scoreTeam1, scoreTeam2, undefined, undefined, matchStatusText);
                        showToast('Live score and status broadcasted');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 shrink-0 cursor-pointer"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. LIVE DARSHAN CAMERAS */}
            {activeTab === 'darshan' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-amber-200">Live Darshan Camera Feeds</h2>
                    <p className="text-xs text-amber-200/70">Configure sanctum, yagasala, and queue camera stream links.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
                    <input
                      type="checkbox"
                      checked={darshanConfig.enabled}
                      onChange={(e) => {
                        toggleDarshanEnabled(e.target.checked);
                        showToast(`Live darshan ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="accent-amber-400"
                    />
                    <span className="text-xs font-bold text-amber-300">Live Telecast Online</span>
                  </label>
                </div>

                {/* Add new camera */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCamName.trim() || !newCamUrl.trim()) return;
                    addCameraStream({
                      name: newCamName.trim(),
                      label: newCamLabel.trim() || newCamName.trim(),
                      streamUrl: newCamUrl.trim(),
                      badge: newCamBadge,
                      status: 'active',
                      order: darshanConfig.cameras.length + 1,
                    });
                    setNewCamName('');
                    setNewCamLabel('');
                    setNewCamUrl('');
                    showToast('Camera feed added to live darshan player');
                  }}
                  className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-3"
                >
                  <label className="block text-xs font-bold text-amber-300 uppercase">Add Camera Stream</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={newCamName}
                      onChange={(e) => setNewCamName(e.target.value)}
                      placeholder="Camera Name (e.g. Cam 05)"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={newCamLabel}
                      onChange={(e) => setNewCamLabel(e.target.value)}
                      placeholder="Location Label (e.g. Annadanam Queue)"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      required
                      value={newCamUrl}
                      onChange={(e) => setNewCamUrl(e.target.value)}
                      placeholder="Stream URL or Image Master"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect Camera Feed</span>
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {darshanConfig.cameras.map((cam) => (
                    <div key={cam.id} className="p-4 rounded-xl bg-black/40 border border-amber-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-heading font-bold text-white text-sm">{cam.name}</span>
                          <p className="text-xs text-amber-200/60">{cam.label}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">
                          {cam.badge}
                        </span>
                      </div>
                      <div className="h-28 rounded-lg bg-black/60 overflow-hidden relative border border-amber-500/10">
                        <img src={cam.streamUrl} alt={cam.label} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-amber-300 font-mono capitalize">Status: {cam.status}</span>
                        <button
                          onClick={() => {
                            deleteCameraStream(cam.id);
                            showToast('Camera feed removed');
                          }}
                          className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. GALLERY & MEDIA */}
            {activeTab === 'gallery' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">Gallery Moments & Youth Archive</h2>
                  <p className="text-xs text-amber-200/70">Manage festival photographs, 4K masters, and achievement citations.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-amber-300/80">Youth Achievements (Featured)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryData.achievements.map((ach) => (
                      <div key={ach.id} className="p-4 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                        <div className="h-32 rounded-lg bg-black/60 overflow-hidden relative">
                          <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-heading font-bold text-sm text-white">{ach.title}</h4>
                        <p className="text-xs text-amber-200/70 line-clamp-2">{ach.description}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                          {ach.awardHonor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 11. FINANCE & SEVA AUDIT (STRICTLY PRIVATE) */}
            {activeTab === 'finance' && (
              <div className="p-6 rounded-2xl temple-glass border-2 border-emerald-500/40 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
                      <Shield className="w-3.5 h-3.5 text-red-400" />
                      <span>Strictly Confidential • Committee Eyes Only</span>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-[#FFFDF5]">
                      Internal Finance & Seva Audit Ledger
                    </h2>
                    <p className="text-xs text-amber-200/70">
                      Private records of seva contributions, hand cash counts, and verified digital UPI tokens.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-300/80 font-bold uppercase">Total Verified Seva Pool</span>
                    <p className="font-heading text-3xl font-black text-emerald-400">
                      ₹{(adminFinance?.totalCollected || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Ledger Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-xs text-amber-200/70">Hand Cash Collected</span>
                    <p className="font-heading text-xl font-bold text-amber-300 mt-1">
                      ₹{(adminFinance?.summary?.cashTotal || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-amber-200/50 mt-1">In Mandapam Safe Custody</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-xs text-amber-200/70">Digital UPI Inflows</span>
                    <p className="font-heading text-xl font-bold text-amber-300 mt-1">
                      ₹{(adminFinance?.summary?.upiTotal || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-amber-200/50 mt-1">Instant Bank Settlement</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-xs text-amber-200/70">Bank NEFT / Major Donors</span>
                    <p className="font-heading text-xl font-bold text-amber-300 mt-1">
                      ₹{(adminFinance?.summary?.bankNeftTotal || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-amber-200/50 mt-1">Silver Jubilee Benefactors</p>
                  </div>
                </div>

                {/* Record New Offline Donation */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newFinDonor.trim() || newFinAmount <= 0) return;
                    addAdminDonationRecord({
                      donorName: newFinDonor.trim(),
                      amount: newFinAmount,
                      sevaType: newFinSeva,
                      paymentMethod: newFinMethod,
                      village: newFinVillage,
                      status: 'Verified',
                    });
                    setNewFinDonor('');
                    setNewFinAmount(1001);
                    showToast('Seva contribution logged to private ledger');
                  }}
                  className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 space-y-3"
                >
                  <label className="block text-xs font-bold text-emerald-300 uppercase">
                    Log Offline / Cash Contribution to Ledger
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      required
                      value={newFinDonor}
                      onChange={(e) => setNewFinDonor(e.target.value)}
                      placeholder="Donor / Family Name"
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="number"
                      required
                      value={newFinAmount}
                      onChange={(e) => setNewFinAmount(parseInt(e.target.value, 10) || 0)}
                      placeholder="Amount in ₹"
                      className="px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <select
                      value={newFinMethod}
                      onChange={(e) => setNewFinMethod(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-[#1e0e0e] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                    >
                      <option value="HAND CASH">HAND CASH</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK NEFT">BANK NEFT</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save to Private Financial Audit</span>
                  </button>
                </form>

                {/* Audit Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-emerald-400">All Verified Audit Transactions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-amber-100/90">
                      <thead className="bg-black/60 text-amber-300 font-bold uppercase border-b border-amber-500/30">
                        <tr>
                          <th className="p-2.5">Txn ID</th>
                          <th className="p-2.5">Donor / Family</th>
                          <th className="p-2.5">Seva Dedicated</th>
                          <th className="p-2.5">Method</th>
                          <th className="p-2.5 text-right">Amount</th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-500/10">
                        {adminFinance.records.map((r) => (
                          <tr key={r.id} className="hover:bg-black/30">
                            <td className="p-2.5 font-mono text-amber-400">{r.txnId}</td>
                            <td className="p-2.5 font-semibold text-white">{r.donorName}</td>
                            <td className="p-2.5 text-amber-200/80">{r.sevaType}</td>
                            <td className="p-2.5 font-mono text-[11px]">{r.paymentMethod}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-400">
                              ₹{(r.amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 12. SYSTEM SETTINGS & EXPORT */}
            {activeTab === 'settings' && (
              <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-amber-200">System Switches & Backup</h2>
                  <p className="text-xs text-amber-200/70">Operational feature toggles and database-free JSON exports.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 space-y-3">
                    <span className="text-xs font-bold uppercase text-amber-400">Feature Switches</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-500/20 cursor-pointer">
                        <span className="font-semibold text-amber-200">Live Darshan Stream</span>
                        <input
                          type="checkbox"
                          checked={settings.enableLiveDarshan}
                          onChange={(e) => {
                            updateSettings({ enableLiveDarshan: e.target.checked });
                            showToast('Darshan toggle updated');
                          }}
                          className="accent-amber-400"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-500/20 cursor-pointer">
                        <span className="font-semibold text-amber-200">Prasad Booking Counter</span>
                        <input
                          type="checkbox"
                          checked={settings.enablePrasadBooking}
                          onChange={(e) => {
                            updateSettings({ enablePrasadBooking: e.target.checked });
                            showToast('Prasad booking toggle updated');
                          }}
                          className="accent-amber-400"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-500/20 cursor-pointer">
                        <span className="font-semibold text-amber-200">Competition Registrations</span>
                        <input
                          type="checkbox"
                          checked={settings.enableCompetitions}
                          onChange={(e) => {
                            updateSettings({ enableCompetitions: e.target.checked });
                            showToast('Competitions toggle updated');
                          }}
                          className="accent-amber-400"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-500/20 cursor-pointer">
                        <span className="font-semibold text-amber-200">Sports Scoreboard</span>
                        <input
                          type="checkbox"
                          checked={settings.enableSportsScoreboard}
                          onChange={(e) => {
                            updateSettings({ enableSportsScoreboard: e.target.checked });
                            showToast('Sports scoreboard toggle updated');
                          }}
                          className="accent-amber-400"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Vercel JSON Backup & Reset Actions */}
                  <div className="p-5 rounded-xl bg-black/40 border border-amber-500/30 space-y-4">
                    <span className="text-xs font-bold uppercase text-amber-400">Vercel JSON Data Operations</span>
                    <p className="text-xs text-amber-200/70 leading-relaxed">
                      All changes are stored in human-readable JSON. To deploy updates permanently to Vercel without a database, download the JSON bundle and commit it to GitHub.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleExportJSON}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 flex items-center gap-2 cursor-pointer shadow"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Full JSON Backup</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Reset all festival content back to default factory JSON?')) {
                            resetToDefaultJSON();
                            showToast('Reset all modules to default JSON configuration');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold text-xs hover:bg-red-900/60 flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to Factory Defaults</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
