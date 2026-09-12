import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Video,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Users,
  Bell,
} from 'lucide-react';
import { INITIAL_DAYS_ITINERARY, INITIAL_COMPETITIONS } from '../data/festivalData';
import { useFestival } from '../context/FestivalContext';
import { RegistrationModal } from '../components/RegistrationModal';

export const EventsPage: React.FC = () => {
  const { playTempleBell, playAartiAlert } = useFestival();
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [selectedCompForReg, setSelectedCompForReg] = useState<string | null>(null);
  const [calendarSubscribed, setCalendarSubscribed] = useState(false);

  const activeDay =
    INITIAL_DAYS_ITINERARY.find((d) => d.dayNumber === activeDayNumber) ||
    INITIAL_DAYS_ITINERARY[0];

  const handleCalendarAdd = (ritualTitle: string, date: string, time: string) => {
    playTempleBell();
    // Simulate Google Calendar add URL
    const title = encodeURIComponent(`Sri Vinayaka Mahotsavam: ${ritualTitle}`);
    const details = encodeURIComponent(`Mandapam Sanctum, B.C. Colony, Srikolanu. Auspicious festival ritual.`);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=Srikolanu`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-[#FFFDF5]">
      {/* 1. Header & Festival Stats */}
      <section className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Bhadrapada Sukla Chavithi to Anantha Chaturdashi • 10 Sacred Days</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#FFFDF5] leading-tight">
          Festival Itinerary & <span className="gold-gradient-text">Cultural Competitions</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed">
          From the sacred Sthapana & Ganapathi Homam to the royal Pushpa Ratham Visarjan, explore our detailed 10-day ritual timeline, spiritual discourses, and village tournament events.
        </p>

        {/* 4 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              10 Days
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Akhanda Pooja
            </p>
          </div>

          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              50,000+
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Pilgrims Expected
            </p>
          </div>

          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              ₹94,500
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Competition Prizes
            </p>
          </div>

          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              5,000 / Day
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Maha Annadanam
            </p>
          </div>
        </div>
      </section>

      {/* 2. 10-Day Interactive Day Tabs & Rituals Timeline */}
      <section className="space-y-6">
        <div className="border-b border-amber-500/20 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Daily Panchangam & Pooja Schedule
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              10-Day Sacred Ritual Matrix
            </h2>
          </div>
          <p className="text-xs text-amber-200/70">
            Select a day to view timings, venue, and live-stream coverage.
          </p>
        </div>

        {/* Day Horizontal Scroller Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {INITIAL_DAYS_ITINERARY.map((day) => {
            const isSelected = activeDayNumber === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                id={`day-tab-${day.dayNumber}`}
                onClick={() => {
                  setActiveDayNumber(day.dayNumber);
                  playTempleBell();
                }}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-[#800000] border-amber-400 shadow-xl scale-102'
                    : 'bg-[#150a0a] border-amber-500/20 hover:border-amber-500/40 text-amber-100/70'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`font-heading font-black text-lg ${
                      isSelected ? 'text-amber-300' : 'text-amber-200'
                    }`}
                  >
                    Day {String(day.dayNumber).padStart(2, '0')}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </div>
                <p className="text-xs font-semibold text-[#FFFDF5] truncate max-w-[130px]">
                  {day.title}
                </p>
                <p className="text-[10px] text-amber-200/60">{day.date}</p>
              </button>
            );
          })}
        </div>

        {/* Active Day Detail Box */}
        <div className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
          {/* Day Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/25 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                  Day {String(activeDay.dayNumber).padStart(2, '0')} • {activeDay.date}
                </span>
                {activeDay.muhurtham && (
                  <span className="text-xs text-amber-300 font-medium">
                    Shubha Muhurtham: <strong>{activeDay.muhurtham}</strong>
                  </span>
                )}
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5] mt-2">
                {activeDay.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-200/80">{activeDay.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCalendarSubscribed(true);
                  playAartiAlert();
                }}
                className="px-4 py-2 rounded-xl bg-black/40 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-black/60 flex items-center gap-1.5 transition"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {calendarSubscribed ? 'WhatsApp Alerts Active' : 'Get WhatsApp Alerts for Day ' + activeDay.dayNumber}
                </span>
              </button>
            </div>
          </div>

          {/* List of Rituals for this day */}
          <div className="space-y-4">
            {activeDay.rituals.map((ritual) => (
              <div
                key={ritual.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  ritual.status === 'ongoing'
                    ? 'bg-[#800000]/50 border-amber-400 shadow-xl'
                    : 'bg-[#180d0d] border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Time badge */}
                  <div className="flex flex-col items-center justify-center w-20 h-16 rounded-xl bg-black/50 border border-amber-500/30 text-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                    <span className="font-heading font-extrabold text-xs text-amber-300">
                      {ritual.time}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-amber-200/60">
                      IST
                    </span>
                  </div>

                  {/* Ritual Description */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {ritual.period}
                      </span>
                      {ritual.tag && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                          {ritual.tag}
                        </span>
                      )}
                      {ritual.status === 'ongoing' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-300 bg-green-950/70 px-2 py-0.5 rounded-full border border-green-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                          LIVE NOW
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading font-bold text-base sm:text-lg text-[#FFFDF5]">
                      {ritual.title}
                    </h4>

                    <p className="text-xs text-amber-200/80 leading-relaxed max-w-2xl">
                      {ritual.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-amber-300/80 pt-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{ritual.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  {ritual.isLiveStreamed && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-red-300 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-500/40">
                      <Video className="w-3 h-3 text-red-400" />
                      <span>4K Live Telecast</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleCalendarAdd(ritual.title, activeDay.date, ritual.time)}
                    className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-500/30 text-amber-200 text-xs font-semibold hover:bg-black/80 flex items-center gap-1 transition"
                  >
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Add to Cal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Village Utsav & Youth Competitions */}
      <section className="space-y-6">
        <div className="border-b border-amber-500/20 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Talent & Sports Championship
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Village Utsav & Youth Competitions
            </h2>
          </div>
          <p className="text-xs text-amber-200/70">
            Open to all residents, colonies, and youth mandalis. Register free online!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_COMPETITIONS.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl temple-glass p-6 border border-amber-500/30 flex flex-col justify-between gap-6 shadow-xl hover:border-amber-400/50 transition group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                    {comp.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Pool: {comp.prizePool}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-[#FFFDF5] group-hover:text-amber-300 transition">
                    {comp.name}
                  </h3>
                  <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                {/* Prize Breakdown */}
                <div className="p-3.5 rounded-xl bg-[#200d0d] border border-amber-500/30 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>🥇 1st Prize:</span>
                    <span>{comp.firstPrize}</span>
                  </div>
                  {comp.secondPrize && (
                    <div className="flex justify-between items-center text-amber-200/80">
                      <span>🥈 2nd Prize:</span>
                      <span>{comp.secondPrize}</span>
                    </div>
                  )}
                  {comp.thirdPrize && (
                    <div className="flex justify-between items-center text-amber-200/60">
                      <span>🥉 3rd Prize:</span>
                      <span>{comp.thirdPrize}</span>
                    </div>
                  )}
                </div>

                {/* Schedule & Venue */}
                <div className="space-y-1 text-xs text-amber-200/70">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{comp.date}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{comp.venue}</span>
                  </p>
                  <p className="text-[11px] text-amber-300/80 font-medium">
                    Jury: {comp.jury}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-xs text-amber-200/70">
                  👥 <strong>{comp.registeredCount}</strong> Registered Entries
                </span>

                <button
                  id={`reg-btn-${comp.id}`}
                  onClick={() => setSelectedCompForReg(comp.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-md border border-amber-300 transition"
                >
                  Register Entry →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Modal Popup */}
      <RegistrationModal
        isOpen={!!selectedCompForReg}
        onClose={() => setSelectedCompForReg(null)}
        defaultCompId={selectedCompForReg || undefined}
      />
    </div>
  );
};
