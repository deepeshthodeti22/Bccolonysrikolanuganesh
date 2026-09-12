import React from 'react';
import { Radio, AlertCircle } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';

export const LiveTicker: React.FC = () => {
  const { announcements } = useFestival();
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div id="live-announcement-ticker" className="bg-[#5a0000] border-b border-[#D4AF37]/30 text-[#FFFDF5] text-xs sm:text-sm font-medium py-2 px-3 sm:px-6 relative overflow-hidden flex items-center z-40 shadow-inner">
      {/* Fixed Live Label */}
      <div className="flex items-center gap-1.5 shrink-0 bg-[#800000] px-2.5 py-1 rounded-full border border-[#FFBF00]/40 mr-3 shadow-md z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span className="font-bold text-[11px] tracking-wider uppercase text-amber-300 flex items-center gap-1">
          <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
          Live Updates
        </span>
      </div>

      {/* Marquee Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {activeAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                ann.priority === 'emergency'
                  ? 'text-red-300 font-bold'
                  : ann.priority === 'urgent'
                  ? 'text-amber-200'
                  : 'text-amber-100/90'
              }`}
            >
              {ann.priority !== 'normal' && (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span>{ann.text}</span>
              <span className="text-[10px] text-amber-400/60 bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                {ann.timestamp}
              </span>
            </div>
          ))}

          {/* Repeat for continuous marquee loop */}
          {activeAnnouncements.map((ann) => (
            <div
              key={`dup-${ann.id}`}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                ann.priority === 'emergency'
                  ? 'text-red-300 font-bold'
                  : ann.priority === 'urgent'
                  ? 'text-amber-200'
                  : 'text-amber-100/90'
              }`}
            >
              {ann.priority !== 'normal' && (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span>{ann.text}</span>
              <span className="text-[10px] text-amber-400/60 bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                {ann.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
