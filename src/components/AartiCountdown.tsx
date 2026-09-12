import React, { useState, useEffect } from 'react';
import { Flame, Bell, Sparkles } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';

export const AartiCountdown: React.FC = () => {
  const { playAartiAlert } = useFestival();
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 48, seconds: 15 });
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);

  useEffect(() => {
    // Calculate countdown towards 06:30 PM (18:30)
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 30, 0, 0);

      // If past 18:30 today, set to tomorrow
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotifyMe = () => {
    setIsAlertSubscribed(true);
    playAartiAlert();
  };

  return (
    <div
      id="aarti-countdown-card"
      className="relative rounded-2xl p-6 md:p-8 temple-glass-crimson border-2 border-amber-400/40 shadow-2xl overflow-hidden"
    >
      {/* Decorative Traditional Corner Motifs */}
      <div className="absolute top-2 left-2 text-amber-300/30 text-xs font-decorative select-none">
        ✦ 卐 ✦
      </div>
      <div className="absolute top-2 right-2 text-amber-300/30 text-xs font-decorative select-none">
        ✦ 卐 ✦
      </div>
      <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Info */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-bold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Next Sacred Ceremony</span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFFDF5] leading-snug">
            Grand Maha Sandhya Aarti
          </h3>

          <p className="text-xs sm:text-sm text-amber-200/80 max-w-md">
            108 Camphor Harathis & Vedic Chanting • Main Sanctum Altar
          </p>

          <p className="text-[11px] font-decorative text-amber-300/70 italic">
            "दीपज्योतिः परंब्रह्म दीपज्योतिर्जनार्दनः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥"
          </p>
        </div>

        {/* Right Timer Matrix */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-black/60 border border-amber-500/40 flex items-center justify-center shadow-inner">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70 mt-1">
                Hours
              </span>
            </div>

            <span className="text-2xl font-bold text-amber-400 animate-pulse -mt-4">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-black/60 border border-amber-500/40 flex items-center justify-center shadow-inner">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70 mt-1">
                Minutes
              </span>
            </div>

            <span className="text-2xl font-bold text-amber-400 animate-pulse -mt-4">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-black/60 border border-amber-500/40 flex items-center justify-center shadow-inner">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-yellow-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70 mt-1">
                Seconds
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            id="aarti-notify-btn"
            onClick={handleNotifyMe}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
              isAlertSubscribed
                ? 'bg-amber-400 text-black'
                : 'bg-black/50 text-amber-200 border border-amber-400/50 hover:bg-amber-500/20'
            }`}
          >
            {isAlertSubscribed ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Bell Reminder Set (Temple Chime Active)</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Notify & Ring Temple Bell</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
