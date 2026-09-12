import React, { useState } from 'react';
import {
  Bell,
  Video,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Flame,
  Code2,
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenLiveStream?: () => void;
  onOpenDonation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenLiveStream,
  onOpenDonation,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { playAartiAlert, isAudioMuted, toggleMute, liveStreamWatching } = useFestival();
  const [bellRung, setBellRung] = useState(false);

  const handleAartiAlert = () => {
    setBellRung(true);
    playAartiAlert();
    setTimeout(() => setBellRung(false), 1200);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events & Itinerary' },
    { id: 'gallery', label: 'Gallery & Archive' },
    { id: 'games', label: 'Games & Scores' },
    { id: 'admin', label: 'Admin Portal' },
    { id: 'backend', label: 'Backend & n8n' },
  ];

  return (
    <header id="main-temple-navbar" className="sticky top-0 z-50 bg-[#120a0a]/90 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Temple Title */}
          <div
            id="brand-logo-container"
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Sacred Kalash / Murti Emblem */}
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#800000] via-[#5a0000] to-[#250000] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg group-hover:border-[#FFBF00] transition-transform duration-300 group-hover:scale-105">
              <span className="text-xl select-none">🕉️</span>
              <div className="absolute -inset-0.5 rounded-full bg-amber-500/20 blur-sm -z-10 group-hover:bg-amber-400/40 transition"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-[#FFFDF5] tracking-wide group-hover:text-amber-300 transition">
                  B.C. Colony Ganesh Utsav
                </span>
                <span className="hidden md:inline-flex items-center text-[10px] uppercase font-bold tracking-widest bg-[#800000]/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  25 Years
                </span>
              </div>
              <p className="text-[11px] text-amber-200/75 tracking-wider uppercase font-semibold">
                Srikolanu • Sri Vinayaka Mahotsavam
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => {
                    setCurrentPage(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-amber-300 bg-amber-950/40 border border-amber-500/30 shadow-sm'
                      : 'text-amber-100/80 hover:text-amber-200 hover:bg-black/30'
                  }`}
                >
                  {link.id === 'backend' && <Code2 className="w-3.5 h-3.5 inline mr-1 text-amber-400" />}
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Badges */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Audio Bell Mute Toggle */}
            <button
              id="temple-audio-toggle"
              onClick={toggleMute}
              title={isAudioMuted ? 'Unmute Temple Bells' : 'Mute Temple Bells'}
              className="p-2 rounded-lg border border-amber-500/25 bg-black/40 text-amber-300 hover:bg-amber-950/40 transition"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Aarti Alert Button */}
            <button
              id="aarti-alert-bell-btn"
              onClick={handleAartiAlert}
              title="Ring Holy Aarti Bell"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/40 text-xs font-bold transition-all shadow-md ${
                bellRung
                  ? 'bg-amber-400 text-[#121212] scale-105'
                  : 'bg-amber-950/60 text-amber-200 hover:bg-amber-900/60 hover:text-amber-100'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${bellRung ? 'animate-bounce text-red-900' : 'text-amber-400'}`} />
              <span>Aarti Alert</span>
            </button>

            {/* Live Darshan CTA with Glow */}
            <button
              id="live-darshan-nav-btn"
              onClick={() => {
                if (onOpenLiveStream) onOpenLiveStream();
                else {
                  setCurrentPage('home');
                  setTimeout(() => {
                    document.getElementById('live-darshan-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#800000] via-[#9e0000] to-[#800000] text-[#FFFDF5] font-bold text-xs sm:text-sm border border-amber-400/50 shadow-lg hover:shadow-red-900/50 hover:border-amber-300 transition group overflow-hidden"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <Video className="w-4 h-4 text-amber-300" />
              <span>Live Darshan</span>
              <span className="hidden xl:inline text-[11px] font-normal text-amber-200/90 ml-1">
                ({liveStreamWatching.toLocaleString()})
              </span>
            </button>

            {/* Online Donation Quick Button */}
            {onOpenDonation && (
              <button
                id="navbar-donate-btn"
                onClick={onOpenDonation}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-amber-200 text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#121212] transition"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Pooja Seva</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-aarti-bell"
              onClick={handleAartiAlert}
              className="p-2 rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-300"
            >
              <Bell className="w-4 h-4 text-amber-400" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-amber-300 border border-amber-500/30 bg-black/40"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div id="mobile-nav-menu" className="lg:hidden border-t border-amber-500/20 bg-[#160c0c] px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setMobileOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-[#800000] text-amber-200 border border-amber-500/40'
                    : 'text-amber-100/90 hover:bg-black/30'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <Sparkles className="w-4 h-4 text-amber-300" />}
              </button>
            );
          })}

          <div className="pt-3 border-t border-amber-500/20 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onOpenLiveStream) onOpenLiveStream();
                else {
                  setCurrentPage('home');
                  setTimeout(() => {
                    document.getElementById('live-darshan-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#800000] border border-amber-500/40 text-amber-200 font-bold text-sm shadow-lg"
            >
              <Video className="w-4 h-4 text-red-400" />
              <span>Watch Live Darshan ({liveStreamWatching} Online)</span>
            </button>

            {onOpenDonation && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDonation();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-sm"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Online Pooja & Donation</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
