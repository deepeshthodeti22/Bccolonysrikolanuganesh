import React, { useState } from 'react';
import {
  ShieldCheck,
  Radio,
  Sliders,
  Send,
  Trash2,
  Plus,
  RefreshCw,
  Trophy,
  Users,
  Clock,
  AlertTriangle,
  Upload,
  Download,
  Lock,
  Unlock,
  Sparkles,
  Flame,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import { CrowdStatus } from '../types';
import confetti from 'canvas-confetti';

export const AdminPage: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncement,
    crowdStatus,
    updateCrowdStatus,
    leaderboard,
    updateLeaderboardScore,
    liveMatch,
    updateLiveMatchScore,
    donations,
    totalDonations,
    addGalleryItem,
    webhookLogs,
    triggerBroadcastWebhook,
    playTempleBell,
    playAartiAlert,
    liveVisitors,
  } = useFestival();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for seamless review, with lock/unlock toggle
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Ticker form
  const [tickerText, setTickerText] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [pushLED, setPushLED] = useState(true);
  const [pushWhatsApp, setPushWhatsApp] = useState(true);

  // Scoreboard form
  const [t1Score, setT1Score] = useState(liveMatch.team1Score);
  const [t2Score, setT2Score] = useState(liveMatch.team2Score);

  // Crowd form
  const [waitMinutes, setWaitMinutes] = useState(crowdStatus.currentWaitMinutes);
  const [gate1Text, setGate1Text] = useState(crowdStatus.gate1Status);
  const [density, setDensity] = useState(crowdStatus.crowdDensity);

  // Gallery upload form
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState<'aarti' | 'mandapam' | 'cultural' | 'prasadam' | 'procession'>('aarti');
  const [mediaUrl, setMediaUrl] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin2026' || passcode === 'ops-lead' || passcode === 'vinayaka') {
      setIsAuthenticated(true);
      setAuthError('');
      playTempleBell();
    } else {
      setAuthError('Invalid Security Passcode. (Hint: use "admin2026")');
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerText.trim()) return;

    addAnnouncement({
      text: tickerText,
      priority,
      isActive: true,
      pushToLED: pushLED,
      pushToWhatsApp: pushWhatsApp,
    });

    setTickerText('');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFBF00', '#800000'],
    });
  };

  const handleQuickPreset = (presetText: string, presetPriority: 'normal' | 'urgent' | 'emergency') => {
    setTickerText(presetText);
    setPriority(presetPriority);
  };

  const handleUpdateMatchScores = () => {
    updateLiveMatchScore(t1Score, t2Score);
    playTempleBell();
  };

  const handleSaveCrowd = () => {
    updateCrowdStatus({
      currentWaitMinutes: waitMinutes,
      gate1Status: gate1Text,
      crowdDensity: density,
    });
    playTempleBell();
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;

    addGalleryItem({
      title: mediaTitle,
      category: mediaCategory,
      timeTag: 'Live Upload • Mandapam Desk',
      photoCount: 1,
      imageUrl:
        mediaUrl ||
        'https://images.unsplash.com/photo-1567591370504-20a22cf88836?auto=format&fit=crop&w=800&q=80',
      is4k: true,
    });

    setMediaTitle('');
    setMediaUrl('');
    alert('Photo published to sacred gallery and live stream feed!');
  };

  const exportDonationCSV = () => {
    const headers = 'Transaction ID,Donor Name,Village,Seva Dedicated,Method,Amount,Status,Time\n';
    const rows = donations
      .map(
        (d) =>
          `"${d.txnId}","${d.donorName}","${d.village}","${d.sevaType}","${d.paymentMethod}","${d.amount}","${d.status}","${d.timestamp}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sri_Vinayaka_Donations_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl temple-glass border-2 border-amber-500/40 text-[#FFFDF5] text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#800000] border-2 border-amber-400 text-amber-300 flex items-center justify-center text-2xl mx-auto shadow-lg">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Committee Clearance Required
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#FFFDF5] mt-1">
            Admin Operations Portal
          </h2>
          <p className="text-xs text-amber-200/70 mt-1">
            Access restricted to verified members of Sri Vinayaka Youth Committee, Srikolanu.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Security Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. admin2026)"
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
            />
            {authError && <p className="text-xs text-red-400 mt-1">{authError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-sm hover:brightness-110 shadow-lg border border-amber-300 flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Verify & Enter Ops Console</span>
          </button>
        </form>

        <button
          onClick={() => {
            setIsAuthenticated(true);
            playTempleBell();
          }}
          className="text-xs text-amber-300/80 underline underline-offset-4 hover:text-amber-200"
        >
          Fast-Track Demo Access (Click to bypass)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-[#FFFDF5]">
      {/* 1. Portal Header & Live Metrics Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/25 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#800000] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Mission Control • Srikolanu
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold bg-green-950 text-green-400 px-2 py-0.5 rounded-full border border-green-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
                Committee Admin & Real-Time Sync Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playAartiAlert();
                alert('Triggered global temple aarti bell chime!');
              }}
              className="px-3 py-2 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-900/60 transition"
            >
              Test Aarti Chime
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-2 rounded-xl bg-black/50 border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-black/80"
            >
              Lock Console
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
              Active Visitors
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              {liveVisitors}
            </span>
            <span className="text-[10px] text-green-400 font-semibold">● Real-time synced</span>
          </div>

          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
              Today's Seva Offerings
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              ₹{totalDonations.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-300/80 font-semibold">{donations.length} verified receipts</span>
          </div>

          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
              Queue Wait Time
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              {crowdStatus.currentWaitMinutes} mins
            </span>
            <span className="text-[10px] text-amber-200 font-semibold">{crowdStatus.crowdDensity} Flow</span>
          </div>

          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
              Broadcast Webhook
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-green-400 flex items-center gap-2">
              <Radio className="w-5 h-5 text-green-400" />
              Connected
            </span>
            <span className="text-[10px] text-amber-200/80 font-semibold">n8n / WhatsApp Engine</span>
          </div>
        </div>
      </section>

      {/* 2. SECTION A: Live Ticker & Announcement Controller */}
      <section className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#FFFDF5]">
              Live News Ticker & Multi-Channel Broadcast Controller
            </h2>
          </div>
          <span className="text-xs text-amber-300/80 font-bold">
            {announcements.filter((a) => a.isActive).length} Active Tickers
          </span>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-xs font-bold text-amber-300 block mb-2">
            Instant One-Click Broadcast Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              {
                text: '🪔 Maha Sandhya Aarti with 108 Deepams commencing in 15 minutes at Sanctum.',
                p: 'urgent' as const,
                label: 'Aarti in 15 Mins',
              },
              {
                text: '🍯 Sacred Modak Prasadam token counters are now open at Mandapam West Counter #03.',
                p: 'normal' as const,
                label: 'Prasad Counters Open',
              },
              {
                text: '🅿️ Gate 2 Parking is currently 85% full. Devotees kindly use Gate 1 South Enclosure.',
                p: 'urgent' as const,
                label: 'Parking Diversion',
              },
              {
                text: '⚠️ Heavy pilgrim influx at North Barricade. Elderly devotees kindly utilize Gate 2 assisted lane.',
                p: 'emergency' as const,
                label: 'Heavy Crowd Influx',
              },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPreset(preset.text, preset.p)}
                className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-500/25 text-amber-200 text-xs font-semibold hover:border-amber-400 hover:bg-black/70 transition"
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Composer Form */}
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-amber-300 font-bold mb-1">
              <span>Announcement Message</span>
              <span className="text-amber-200/60 font-mono">{tickerText.length} / 180 chars</span>
            </div>
            <textarea
              required
              rows={2}
              maxLength={180}
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              placeholder="Enter announcement text to broadcast to Website Marquee Ticker, Pandal LED signs, and WhatsApp..."
              className="w-full p-3 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Priority Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">Priority:</span>
              {(['normal', 'urgent', 'emergency'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    priority === p
                      ? p === 'emergency'
                        ? 'bg-red-700 text-white border border-red-400'
                        : p === 'urgent'
                        ? 'bg-amber-500 text-black border border-amber-300'
                        : 'bg-[#800000] text-amber-200 border border-amber-400'
                      : 'bg-black/40 text-amber-100/70 border border-amber-500/20'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Target Channel Toggles */}
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-200">
                <input
                  type="checkbox"
                  checked={pushLED}
                  onChange={(e) => setPushLED(e.target.checked)}
                  className="accent-amber-400"
                />
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Pandal LED Screens</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-amber-200">
                <input
                  type="checkbox"
                  checked={pushWhatsApp}
                  onChange={(e) => setPushWhatsApp(e.target.checked)}
                  className="accent-amber-400"
                />
                <Send className="w-3.5 h-3.5 text-green-400" />
                <span>WhatsApp Broadcast</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="broadcast-ticker-btn"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-lg border border-amber-300 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>

        {/* Existing Announcements List */}
        <div className="space-y-2 pt-2 border-t border-amber-500/20">
          <span className="text-xs font-bold text-amber-300 block mb-1">
            Current Live Tickers on Home Page:
          </span>
          <div className="space-y-2">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAnnouncement(ann.id)}
                    className={`w-3 h-3 rounded-full ${
                      ann.isActive ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                    title="Toggle active status"
                  />
                  <span
                    className={`font-semibold ${
                      ann.isActive ? 'text-amber-100' : 'text-gray-500 line-through'
                    }`}
                  >
                    {ann.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-amber-400/70 font-mono bg-black/50 px-2 py-0.5 rounded">
                    {ann.priority}
                  </span>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-950/40 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION B: Live Scoreboard & Queue Flow Control */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scoreboard Manager */}
        <div className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-amber-500/20 pb-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-heading text-xl font-bold text-[#FFFDF5]">
              Live Scoreboard Controller
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c0c0c] border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>{liveMatch.court}</span>
              <span className="text-amber-400/80">{liveMatch.half}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Team 1 Score Adjuster */}
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                <span className="font-bold text-xs text-amber-100 block">{liveMatch.team1}</span>
                <div className="font-heading text-3xl font-black text-amber-300">{t1Score}</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setT1Score((s) => Math.max(0, s - 1))}
                    className="px-2.5 py-1 rounded bg-[#800000] text-amber-200 font-bold"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setT1Score((s) => s + 1)}
                    className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Team 2 Score Adjuster */}
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                <span className="font-bold text-xs text-amber-100 block">{liveMatch.team2}</span>
                <div className="font-heading text-3xl font-black text-amber-300">{t2Score}</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setT2Score((s) => Math.max(0, s - 1))}
                    className="px-2.5 py-1 rounded bg-[#800000] text-amber-200 font-bold"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setT2Score((s) => s + 1)}
                    className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpdateMatchScores}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-md border border-amber-300"
            >
              Push Score Update to Public Games Page
            </button>
          </div>
        </div>

        {/* Queue & Crowd Controller */}
        <div className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-amber-500/20 pb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-heading text-xl font-bold text-[#FFFDF5]">
              Queue & Crowd Flow Manager
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-amber-300 font-bold mb-1">
                <span>Estimated Wait Time (Minutes):</span>
                <span className="text-amber-400 font-mono font-black text-base">{waitMinutes}m</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={waitMinutes}
                onChange={(e) => setWaitMinutes(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Gate 1 General Status
                </label>
                <input
                  type="text"
                  value={gate1Text}
                  onChange={(e) => setGate1Text(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Crowd Density
                </label>
                <select
                  value={density}
                  onChange={(e) => setDensity(e.target.value as CrowdStatus['crowdDensity'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c0c0c] border border-amber-500/30 text-amber-100 text-xs"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Peak">Peak</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveCrowd}
              className="w-full py-2.5 rounded-xl bg-[#800000] border border-amber-400 text-amber-200 font-heading font-bold text-xs hover:bg-[#900000] transition"
            >
              Update Crowd Status on Live App
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION C: Public Seva & Donations Financial Transparency Ledger */}
      <section className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              <span>100% Transparency</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#FFFDF5]">
              Real-Time Seva & Donation Ledger
            </h2>
          </div>

          <button
            onClick={exportDonationCSV}
            className="px-4 py-2 rounded-xl bg-black/40 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-black/70 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Verified Audit Sheet (CSV)</span>
          </button>
        </div>

        <div className="rounded-2xl border border-amber-500/20 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#200d0d] text-amber-300 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Receipt Txn</th>
                <th className="p-3">Donor Name</th>
                <th className="p-3">Village / Origin</th>
                <th className="p-3">Seva Type</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-black/40 transition">
                  <td className="p-3 font-mono text-amber-300 font-semibold">{d.txnId}</td>
                  <td className="p-3 font-bold text-[#FFFDF5]">{d.donorName}</td>
                  <td className="p-3 text-amber-200/70">{d.village}</td>
                  <td className="p-3 text-amber-200">{d.sevaType}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-black/50 text-amber-300 text-[10px] border border-amber-500/20">
                      {d.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-right font-heading font-black text-amber-300">
                    ₹{d.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-green-950 text-green-400 text-[10px] font-bold border border-green-500/30">
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-amber-200/60 text-[10px]">{d.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. SECTION D: n8n Webhook & WhatsApp Live Broadcast Simulator */}
      <section className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-heading text-xl font-bold text-[#FFFDF5]">
                n8n Automation & Webhook Integration Logs
              </h2>
              <p className="text-xs text-amber-200/70">
                Dispatches real-time WhatsApp devotee alerts, Pandal LED updates, and SSE events.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerBroadcastWebhook(
                'Grand Maha Sandhya Aarti live link generated. Tap to watch 4K stream.',
                'urgent',
                ['WhatsApp', 'Pandal LED', 'Website SSE']
              );
              playTempleBell();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Trigger n8n Webhook Event</span>
          </button>
        </div>

        <div className="space-y-2">
          {webhookLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-black/50 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#800000] text-amber-200 text-[10px] font-bold">
                  {log.channel}
                </span>
                <span className="text-amber-300 font-bold">{log.timestamp}</span>
                <span className="text-amber-100/70 truncate max-w-md">{log.payload}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-green-950 text-green-400 text-[10px] font-bold border border-green-500/30 shrink-0">
                ✓ {log.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
