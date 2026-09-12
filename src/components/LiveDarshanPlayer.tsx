import React, { useState } from 'react';
import {
  Video,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Camera,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFestival } from '../context/FestivalContext';

interface LiveDarshanProps {
  onDonateClick?: () => void;
  onPrasadClick?: () => void;
}

export const LiveDarshanPlayer: React.FC<LiveDarshanProps> = ({
  onDonateClick,
  onPrasadClick,
}) => {
  const {
    liveStreamWatching,
    activeCamera,
    setActiveCamera,
    playTempleBell,
  } = useFestival();

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [pranamsCount, setPranamsCount] = useState(8490);
  const [hasOfferedFlower, setHasOfferedFlower] = useState(false);

  const cameras = [
    {
      id: 'cam-1',
      name: 'Sanctum Cam 01',
      label: 'Main Sanctum Murti',
      img: 'https://images.unsplash.com/photo-1567591370504-20a22cf88836?auto=format&fit=crop&w=1200&q=85',
      badge: 'LIVE UHD',
    },
    {
      id: 'cam-2',
      name: 'Yagasala Cam 02',
      label: 'Maha Homa Kundam',
      img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85',
      badge: 'HAVAN',
    },
    {
      id: 'cam-3',
      name: 'Queue Cam 03',
      label: 'Devotee Pradakshina Gate',
      img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=85',
      badge: 'FLOW',
    },
    {
      id: 'cam-4',
      name: 'Auditorium Cam 04',
      label: 'Cultural Dias Stage',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
      badge: 'STAGE',
    },
  ];

  const currentCam = cameras.find((c) => c.id === activeCamera) || cameras[0];

  const handleOfferFlowers = () => {
    setPranamsCount((prev) => prev + 1);
    setHasOfferedFlower(true);
    playTempleBell();

    // Trigger marigold & vermilion flower petals confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFBF00', '#FF8C00', '#800000', '#FFFDF5', '#D4AF37'],
      shapes: ['circle'],
      scalar: 1.2,
    });

    setTimeout(() => setHasOfferedFlower(false), 2000);
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('live-darshan-player-box');
    if (elem?.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div id="live-darshan-section" className="space-y-4">
      {/* Player Frame */}
      <div
        id="live-darshan-player-box"
        className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black shadow-2xl group"
      >
        {/* Stream Visual Container */}
        <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center">
          <img
            src={currentCam.img}
            alt={currentCam.label}
            className="w-full h-full object-cover brightness-95 contrast-105 transition-all duration-700 transform group-hover:scale-102"
          />

          {/* Traditional Divine Radiant Aura / Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none"></div>

          {/* Top Info Bar */}
          <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between z-20 pointer-events-none">
            {/* Live Indicator & Viewers */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs shadow-lg tracking-wider border border-red-400">
                <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                LIVE
              </span>
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 text-xs font-semibold border border-amber-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                {liveStreamWatching.toLocaleString()} Devotees
              </span>
              <span className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 text-[11px] font-bold border border-amber-500/40">
                {currentCam.badge}
              </span>
            </div>

            {/* Quick Stream Controls */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30 hover:bg-black/80 transition"
                title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleFullscreen}
                className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30 hover:bg-black/80 transition"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Chanting Mantra Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 hover:opacity-30 transition">
            <span className="font-decorative text-4xl sm:text-6xl text-amber-300 select-none">
              ॐ गं गणपतये नमः
            </span>
          </div>

          {/* Bottom Overlay Controls inside Video */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-bold text-base sm:text-xl text-[#FFFDF5]">
                  {currentCam.label}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  • Sri Ratna Ganesha
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                B.C. Colony Mandapam Sanctum • Live Prasad Archana Ongoing
              </p>
            </div>

            {/* Devotional Interactivity Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="offer-flowers-btn"
                onClick={handleOfferFlowers}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all shadow-lg ${
                  hasOfferedFlower
                    ? 'bg-amber-400 text-black border-amber-300 scale-105'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#121212] border-amber-300 hover:brightness-110'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Offer Flower Pushpa ({pranamsCount.toLocaleString()})</span>
              </button>

              {onDonateClick && (
                <button
                  id="darshan-donate-btn"
                  onClick={onDonateClick}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#800000] border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-semibold hover:bg-[#990000] transition"
                >
                  <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                  <span>Sponsor Pooja</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Camera Selector Bar Below Stream */}
        <div className="p-3 sm:p-4 bg-[#140b0b] border-t border-amber-500/30 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 shrink-0">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Angle Switcher:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {cameras.map((cam) => {
              const isSelected = cam.id === activeCamera;
              return (
                <button
                  key={cam.id}
                  id={`cam-switch-${cam.id}`}
                  onClick={() => {
                    setActiveCamera(cam.id);
                    playTempleBell();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#800000] text-amber-200 border border-amber-400 shadow-md font-bold'
                      : 'bg-black/50 text-amber-100/70 border border-amber-500/20 hover:text-amber-200 hover:bg-black/80'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-400 animate-ping' : 'bg-gray-500'}`}></span>
                  {cam.name}
                </button>
              );
            })}
          </div>

          {onPrasadClick && (
            <button
              id="darshan-book-prasad-btn"
              onClick={onPrasadClick}
              className="hidden md:inline-flex text-xs font-bold text-amber-300 underline underline-offset-4 hover:text-amber-200 shrink-0"
            >
              Order Blessed Prasad Delivered →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
