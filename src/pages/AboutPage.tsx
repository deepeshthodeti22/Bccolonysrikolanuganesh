import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  Heart,
  Phone,
  Volume2,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from 'lucide-react';
import { MYTH_STORIES, COMMITTEE_MEMBERS } from '../data/festivalData';
import { useFestival } from '../context/FestivalContext';

export const AboutPage: React.FC = () => {
  const { playTempleBell } = useFestival();
  const [expandedStoryId, setExpandedStoryId] = useState<string>(MYTH_STORIES?.[0]?.id || 'story-1');
  const [playingShlokaId, setPlayingShlokaId] = useState<string | null>(null);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerWing, setVolunteerWing] = useState('Prasadam Distribution');
  const [volunteerJoined, setVolunteerJoined] = useState(false);

  const handlePlayShloka = (storyId: string) => {
    setPlayingShlokaId(storyId);
    playTempleBell();
    setTimeout(() => {
      setPlayingShlokaId(null);
    }, 2500);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone) return;
    setVolunteerJoined(true);
    playTempleBell();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-[#FFFDF5]">
      {/* 1. Regal Header & Jubilee Badge */}
      <section className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>1999 – 2026 • 25th Silver Jubilee Celebrations</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#FFFDF5] leading-tight">
          The Sacred Chronicles & <span className="gold-gradient-text">Colony Heritage</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed">
          Upholding ancient Sanatana Dharma, authentic sculptural artistry, Vedic rituals, and inclusive community brotherhood in Srikolanu for a quarter of a century.
        </p>

        {/* 4 Core Pillars / Impact Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/25">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300 block">
              25 Yrs
            </span>
            <span className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider">
              Unbroken Seva
            </span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/25">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300 block">
              25,000+
            </span>
            <span className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider">
              Annadanam Meals
            </span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/25">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300 block">
              100%
            </span>
            <span className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider">
              Eco-Clay Heritage
            </span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/25">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-300 block">
              15,000+
            </span>
            <span className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider">
              Expected Pilgrims
            </span>
          </div>
        </div>
      </section>

      {/* 2. Mythological Chronicle of Lord Ganesha */}
      <section className="space-y-6">
        <div className="border-b border-amber-500/20 pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Puranic Wisdom
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Mythological Chronicles of Lord Ganesha
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs text-amber-200/60 font-decorative">
            श्रीमन्महागणाधिपतये नमः
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {MYTH_STORIES.map((story) => {
            const isExpanded = expandedStoryId === story.id;
            return (
              <div
                key={story.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'temple-glass border-amber-400 shadow-2xl'
                    : 'bg-[#150a0a] border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                <div
                  onClick={() => setExpandedStoryId(isExpanded ? '' : story.id)}
                  className="p-5 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#800000] border border-amber-500/40 flex items-center justify-center font-heading text-amber-300 font-bold shrink-0">
                      🕉️
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {story.khanda}
                      </span>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#FFFDF5]">
                        {story.title}
                      </h3>
                      <p className="text-xs text-amber-200/70">{story.subtitle}</p>
                    </div>
                  </div>

                  <button className="p-1 rounded-lg text-amber-300 hover:bg-black/30">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-amber-500/20 pt-4">
                    <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-amber-500/30">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                      {story.content}
                    </p>

                    {/* Sacred Shloka Box */}
                    <div className="p-4 rounded-xl bg-[#250000]/60 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          Sacred Inscription
                        </span>
                        <button
                          onClick={() => handlePlayShloka(story.id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30 hover:bg-black/70 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{playingShlokaId === story.id ? 'Chanting...' : 'Play Chant'}</span>
                        </button>
                      </div>
                      <p className="font-heading text-xs sm:text-sm text-amber-200 font-bold whitespace-pre-line leading-relaxed">
                        {story.shloka}
                      </p>
                      <p className="text-[11px] text-amber-300/70 italic border-t border-amber-500/20 pt-1.5">
                        "{story.shlokaMeaning}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. The 25-Year Colony Story Timeline (1999 to 2026) */}
      <section className="rounded-3xl temple-glass p-6 sm:p-10 border-2 border-amber-500/30 space-y-8 shadow-2xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Colony Archive</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
            The Journey of B.C. Colony Ganesh Utsav (1999 – 2026)
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80">
            How a humble clay idol crafted by 12 village youths blossomed into one of Andhra Pradesh’s most revered, socially conscious, and community-driven festivals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#1c0c0c] border border-amber-500/30 space-y-2">
            <span className="font-heading text-xl font-black text-amber-400">1999: The Genesis</span>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Started by 12 spirited youth in B.C. Colony with a modest 3-foot idol under a palmyra palm thatch canopy. The first Annadanam served 50 elders with pure devotion and community contributions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1c0c0c] border border-amber-500/30 space-y-2">
            <span className="font-heading text-xl font-black text-amber-400">2010: The Green Revolution</span>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              The committee pioneered the 100% Eco-Clay pledge, strictly abolishing plaster-of-Paris (PoP) and toxic paints, embedding organic seed balls into every idol for floral rebirth upon immersion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#800000]/40 border border-amber-400 space-y-2">
            <span className="font-heading text-xl font-black text-amber-300">2026: Silver Jubilee Era</span>
            <p className="text-xs text-amber-100 leading-relaxed">
              Celebrating 25 years with high-definition live darshan, traditional prasadam, village sports tournaments, educational sponsorships, and 15,000+ expected pilgrim footfalls.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Committee Leadership */}
      <section className="space-y-6">
        <div className="border-b border-amber-500/20 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Selfless Stewards
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Sri Vinayaka Youth Committee Leadership
            </h2>
          </div>
          <p className="text-xs text-amber-200/70">
            Dedicated elders and youth organizers serving the Lord and the village.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMITTEE_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl temple-glass p-5 border border-amber-500/30 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-400 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      {member.badge}
                    </span>
                    <h4 className="font-heading font-bold text-base text-[#FFFDF5] mt-1">
                      {member.name}
                    </h4>
                    <p className="text-xs text-amber-300 font-semibold">{member.role}</p>
                  </div>
                </div>

                <p className="text-xs text-amber-200/70 leading-relaxed">
                  {member.responsibility}
                </p>

                <div className="text-[11px] text-amber-400/90 font-medium">
                  • {member.yearsOfSeva} Years of Unbroken Seva
                </div>
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:text-amber-100"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{member.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Volunteer Registration Form */}
      <section className="rounded-3xl temple-glass-crimson p-6 sm:p-10 border-2 border-amber-400/50 shadow-2xl">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Join Festival Seva Force</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
            Register for Silver Jubilee Volunteer Seva
          </h2>

          <p className="text-xs sm:text-sm text-amber-200/80">
            Serve Lord Vinayaka in queue coordination, Annadanam distribution, water stalls, or cultural stage management. All volunteers receive sanctum blessings, commemorative identity badges, and certificates.
          </p>

          {!volunteerJoined ? (
            <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    placeholder="e.g. K. Vamsi Krishna"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                    placeholder="+91 98480..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Preferred Seva Wing
                </label>
                <select
                  value={volunteerWing}
                  onChange={(e) => setVolunteerWing(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c0c0c] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Prasadam & Annadanam Serving">Prasadam & Annadanam Serving</option>
                  <option value="Elder & Wheelchair Assistance">Elder & Wheelchair Assistance</option>
                  <option value="Queue & Darshan Barricades">Queue & Darshan Barricades</option>
                  <option value="Cultural Stage & Sound Ops">Cultural Stage & Sound Ops</option>
                  <option value="Live Stream & Media Broadcast">Live Stream & Media Broadcast</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-heading font-bold text-sm hover:brightness-110 shadow-xl border border-amber-300"
              >
                Submit Volunteer Application
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-black/50 border border-green-500/40 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto" />
              <h4 className="font-heading text-lg font-bold text-[#FFFDF5]">
                Thank you for your Seva dedication, {volunteerName}!
              </h4>
              <p className="text-xs text-amber-200/80">
                The Youth Convener (Sri Balaji: +91 8985002875) will WhatsApp you regarding volunteer briefing and your Seva ID badge.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
