import React, { useState } from 'react';
import {
  Video,
  Clock,
  Flame,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Heart,
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import { AartiCountdown } from '../components/AartiCountdown';
import { LiveDarshanPlayer } from '../components/LiveDarshanPlayer';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  onOpenPrasadModal: () => void;
  onOpenDonationModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenPrasadModal,
  onOpenDonationModal,
}) => {
  const {
    festivalInfo,
    events,
    galleryData,
    prasadItems,
    isChantPlaying,
    togglePlayChant,
    nextChant,
    prevChant,
    currentChant,
    playTempleBell,
  } = useFestival();

  const [activePhotoPreview, setActivePhotoPreview] = useState<string | null>(null);
  const [showElderNotice, setShowElderNotice] = useState(false);

  const todayItinerary = events?.[0] || {
    dayNumber: 1,
    title: 'Ganesh Chaturthi Prathama Pooja',
    subtitle: 'Maha Sthapana & Avahana',
    rituals: [],
  };
  const ongoingRitual = todayItinerary.rituals?.find((r) => r.status === 'ongoing') || todayItinerary.rituals?.[0] || {
    period: 'MORNING',
    title: 'Maha Ganapathi Pooja',
    description: 'Consecration rituals and sacred deepa aradhana.',
    venue: 'Main Sanctum',
    time: '08:00 AM',
  };
  const upcomingRituals = (todayItinerary.rituals || []).filter((r) => r.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Regal Hero Section */}
      <section id="hero-sanctum-section" className="relative pt-6 sm:pt-10 overflow-hidden">
        {/* Background Aura Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#800000]/40 via-[#FFBF00]/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Sacred Sanskrit Shloka Pill */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/60 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-semibold shadow-lg">
              <span className="text-amber-400">✦</span>
              <span className="font-decorative tracking-wider">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ
              </span>
              <span className="text-amber-400">✦</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFFDF5] tracking-tight leading-tight max-w-4xl mx-auto">
              Sri Vinayaka <span className="gold-gradient-text">Mahotsavam</span> 2026
            </h1>

            <p className="text-sm sm:text-lg text-amber-200/80 max-w-2xl mx-auto font-medium">
              Celebrating 25 Glorious Years of Sacred Devotion, Vibrant Culture & Unbroken Community Unity in Srikolanu.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-semibold text-amber-300/80">
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-amber-500/25">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                100% Public Transparency
              </span>
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-amber-500/25">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                25th Silver Jubilee Edition
              </span>
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-amber-500/25">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                20,000+ Daily Devotees
              </span>
            </div>
          </div>

          {/* Countdown & Quick Action Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Aarti Countdown Block */}
            <div className="lg:col-span-8">
              <AartiCountdown />
            </div>

            {/* Quick CTAs Card */}
            <div className="lg:col-span-4 rounded-2xl temple-glass p-6 flex flex-col justify-between gap-4 border border-amber-500/30">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Immediate Sacred Actions
                </span>
                <h3 className="font-heading text-xl font-bold text-[#FFFDF5]">
                  Devotee Seva Access
                </h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  Participate remotely or visit the mandapam in person with fast-track digital passes.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  id="hero-book-prasad-btn"
                  onClick={onOpenPrasadModal}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#121212] font-heading font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg border border-amber-300 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Reserve Sacred Prasad Token
                  </span>
                  <span>→</span>
                </button>

                <button
                  id="hero-donate-seva-btn"
                  onClick={onOpenDonationModal}
                  className="w-full py-3 px-4 rounded-xl bg-[#800000] border border-amber-400/60 text-amber-200 font-heading font-bold text-xs sm:text-sm hover:bg-[#990000] shadow-md flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Offer Pooja / Annadanam Seva
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Darshan Stream Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Direct Sanctum Feed
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Live 4K Temple Darshan
            </h2>
          </div>
          <p className="text-xs text-amber-200/80">
            Switch between 4 temple cameras with real-time audio and divine blessings.
          </p>
        </div>

        <LiveDarshanPlayer
          onDonateClick={onOpenDonationModal}
          onPrasadClick={onOpenPrasadModal}
        />
      </section>

      {/* 3. Core Quick Access Matrix: Rituals, Prasad & Queue Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Today's Ritual Status */}
          <div
            id="quick-rituals-card"
            className="rounded-2xl temple-glass p-6 border border-amber-500/30 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-400/50 transition group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                  Day 01 • Sthapana
                </span>
                <span className="flex items-center gap-1 text-[11px] text-green-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Pooja In Progress
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-[#FFFDF5]">
                Today's Sacred Schedule
              </h3>

              {/* Ongoing Ritual Highlight */}
              <div className="p-3.5 rounded-xl bg-[#800000]/40 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>{ongoingRitual.period}</span>
                  <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded text-[10px]">
                    LIVE NOW
                  </span>
                </div>
                <p className="font-bold text-sm text-[#FFFDF5]">{ongoingRitual.title}</p>
                <p className="text-xs text-amber-200/70 line-clamp-2">
                  {ongoingRitual.description}
                </p>
              </div>

              {/* Upcoming preview list */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold uppercase text-amber-300/80">Coming Up:</p>
                {upcomingRituals.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between text-xs p-2 rounded-lg bg-black/30 border border-amber-500/15"
                  >
                    <div>
                      <span className="font-semibold text-amber-100">{r.title}</span>
                      <p className="text-[10px] text-amber-200/60">{r.venue}</p>
                    </div>
                    <span className="text-amber-400 font-bold shrink-0 ml-2">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentPage('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-950/40 flex items-center justify-center gap-1.5 transition"
            >
              <span>View Full 10-Day Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Prasad Availability & Fast Booking */}
          <div
            id="quick-prasad-card"
            className="rounded-2xl temple-glass p-6 border border-amber-500/30 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-400/50 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                  Prasadam & Annadanam
                </span>
                <span className="text-xs text-amber-300 font-bold">Counter Open</span>
              </div>

              <h3 className="font-heading text-xl font-bold text-[#FFFDF5]">
                Holy Prasad Tokens
              </h3>

              <div className="space-y-2.5">
                {prasadItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-[#FFFDF5]">{item.name}</p>
                      <p className="text-[11px] text-amber-400/80">
                        {item.availableCount} {item.unit} available
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-bold text-amber-300 text-sm">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-amber-200/70 italic">
                * Consecrated with pure organic cow ghee & jaggery according to Vedic traditions.
              </p>
            </div>

            <button
              onClick={onOpenPrasadModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-md flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Blessed Prasad Now</span>
            </button>
          </div>

          {/* Card 3: Mandapam Gate & Queue Flow */}
          <div
            id="quick-queue-card"
            className="rounded-2xl temple-glass p-6 border border-amber-500/30 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-400/50 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                  Mandapam Logistics
                </span>
                <span className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Active Flow
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-[#FFFDF5]">
                Queue & Darshan Access
              </h3>

              {/* Wait time display */}
              <div className="p-4 rounded-xl bg-[#800000]/30 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-300/80">
                    Typical Queue Time
                  </span>
                  <div className="font-heading text-3xl font-black text-amber-300">
                    ~5-10 <span className="text-sm font-normal text-amber-100">mins</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                    Crowd Density
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white font-bold text-xs inline-block mt-0.5">
                    Smooth
                  </span>
                </div>
              </div>

              {/* Gate conditions */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-amber-500/15">
                  <span className="text-amber-200/90 font-medium">Gate 1 (General Entry):</span>
                  <span className="text-green-400 font-bold">Open & Moving</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-amber-500/15">
                  <span className="text-amber-200/90 font-medium">Gate 2 (Elder & Wheelchair):</span>
                  <span className="text-amber-300 font-bold">Direct Assistance</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-amber-500/15 text-[11px]">
                  <span className="text-amber-200/70">Aarti Confluence:</span>
                  <span className="text-amber-300 font-bold">07:00 PM & 09:00 PM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playTempleBell();
                  setShowElderNotice(true);
                }}
                className="w-full py-2.5 rounded-xl bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-950/40 transition"
              >
                Request Elder / Wheelchair Help
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Elder Notice Modal */}
      {showElderNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl temple-glass border border-amber-400 space-y-4 text-center">
            <h4 className="font-heading text-xl font-bold text-amber-200">Elder & Wheelchair Seva</h4>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              Complimentary wheelchair and priority shaded seating are stationed at Gate 2.
              Volunteers are on standby to accompany senior devotees directly to sanctum darshan.
            </p>
            <p className="text-xs font-mono text-amber-300 font-bold">
              Helpline: {festivalInfo.contacts.helpline}
            </p>
            <button
              onClick={() => setShowElderNotice(false)}
              className="px-6 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* 4. Sanctum Sounds Audio Player */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl temple-glass-crimson p-6 sm:p-8 border-2 border-amber-400/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black/50 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
              <Music className={`w-7 h-7 ${isChantPlaying ? 'animate-bounce text-amber-400' : ''}`} />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Sanctum Audio
                </span>
                <span className="text-xs text-amber-200/70 font-mono">
                  {currentChant.duration}
                </span>
              </div>
              <h4 className="font-heading font-bold text-lg sm:text-xl text-[#FFFDF5]">
                {currentChant.title}
              </h4>
              <p className="text-xs text-amber-200/80">
                {currentChant.subtitle}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevChant}
              className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 hover:bg-black/70 transition"
              title="Previous Devotional Chant"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayChant}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold flex items-center justify-center shadow-lg hover:scale-105 transition"
              title={isChantPlaying ? 'Pause Chant' : 'Play Sacred Chant'}
            >
              {isChantPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={nextChant}
              className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 hover:bg-black/70 transition"
              title="Next Devotional Chant"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Daily Alankaram & Sacred Moments Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Divine Glimpses
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Daily Alankaram & Sacred Moments
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
          >
            <span>Explore Full 25-Year Gallery & Idol Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryData.moments.slice(0, 3).map((moment) => (
            <div
              key={moment.id}
              onClick={() => setActivePhotoPreview(moment.imageUrl)}
              className="rounded-2xl overflow-hidden border border-amber-500/30 bg-[#160c0c] shadow-xl group cursor-pointer hover:border-amber-400 transition"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  {moment.timeTag}
                </div>
                {moment.is4k && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#800000] text-amber-200 font-extrabold text-[10px] border border-amber-400/40">
                    4K MASTER
                  </div>
                )}
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-heading font-bold text-base text-[#FFFDF5] group-hover:text-amber-300 transition">
                  {moment.title}
                </h4>
                <p className="text-xs text-amber-200/60">
                  {moment.photoCount} High-Res Photos • {moment.views} Devotees Viewed
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Lightbox Preview */}
      {activePhotoPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActivePhotoPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl">
            <img
              src={activePhotoPreview}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setActivePhotoPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-amber-300 hover:text-white border border-amber-500/40"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
