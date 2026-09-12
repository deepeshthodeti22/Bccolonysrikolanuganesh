import React, { useState } from 'react';
import {
  Camera,
  Eye,
  Award,
  Sparkles,
  Heart,
  Calendar,
  X,
  ShieldCheck,
  CheckCircle,
  Trophy,
  Medal,
  Star,
  Users,
  Maximize2,
} from 'lucide-react';
import {
  GALLERY_MOMENTS,
  HISTORICAL_VAULT,
  SPONSORS,
  ACHIEVEMENTS_DATA,
} from '../data/festivalData';
import { useFestival } from '../context/FestivalContext';
import { DonationModal } from '../components/DonationModal';

export const GalleryPage: React.FC = () => {
  const { galleryItems, playTempleBell } = useFestival();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVaultYear, setSelectedVaultYear] = useState<number | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    url: string;
    title: string;
    subtitle?: string;
    award?: string;
  } | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Sacred Moments' },
    { id: 'achievements', label: '🏆 Youth Achievements' },
    { id: 'aarti', label: "Today's Maha Aarti" },
    { id: 'mandapam', label: 'Sanctum & Yagasala' },
    { id: 'cultural', label: 'Cultural Nights & Drama' },
    { id: 'prasadam', label: 'Annadanam Seva' },
    { id: 'procession', label: 'Royal Rathotsavam' },
  ];

  const filteredGallery =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const filteredVault = selectedVaultYear
    ? HISTORICAL_VAULT.filter((v) => v.year === selectedVaultYear)
    : HISTORICAL_VAULT;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-[#FFFDF5]">
      {/* 1. Archive Header & Heritage Stats */}
      <section className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Visual Chronicles • 1999 – 2026 Jubilee Vault</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#FFFDF5] leading-tight">
          Sacred Visual Archive & <span className="gold-gradient-text">Idol Heritage Vault</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed">
          Relive 25 years of divine alankarams, intricate architectural pandals, ecstatic processions, and timeless community seva through high-resolution photography and historical retrospectives.
        </p>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              120+
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Archived Moments
            </p>
          </div>
          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              25 Yrs
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Sculptural Heritage
            </p>
          </div>
          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              4K UHD
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Crystal Master Recaps
            </p>
          </div>
          <div className="p-4 rounded-2xl temple-glass border border-amber-500/30">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-300">
              10,000+
            </span>
            <p className="text-[11px] uppercase font-bold text-amber-200/70 tracking-wider mt-1">
              Devotees Captured
            </p>
          </div>
        </div>
      </section>

      {/* 2. Sri Vinayaka Youth Society Achievements & Milestones Showcase */}
      <section className="rounded-3xl bg-gradient-to-b from-[#2a0808] via-[#1a0505] to-[#121212] p-6 sm:p-10 border-2 border-amber-500/40 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Youth Pride & Milestones • B.C. Colony Srikolanu</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-[#FFFDF5]">
              Society Achievements & <span className="gold-gradient-text">Honours Showcase</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl leading-relaxed">
              Celebrating the relentless seva, devotional spirit, and organizational excellence of our B.C. Colony Sri Vinayaka Youth Society members who make every festival a grand triumph.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-black font-heading font-black text-xs shadow-lg flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-black" />
              4 Golden Honors
            </span>
          </div>
        </div>

        {/* 4 Achievements Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          {ACHIEVEMENTS_DATA.map((ach, idx) => (
            <div
              key={ach.id}
              className="rounded-2xl bg-[#180a0a]/90 border border-amber-500/40 overflow-hidden shadow-2xl hover:border-amber-400 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Zoom & Badge */}
                <div
                  className="relative aspect-4/3 overflow-hidden cursor-pointer bg-black/60"
                  onClick={() => {
                    setLightboxData({
                      url: ach.imageUrl,
                      title: ach.title,
                      subtitle: ach.team,
                      award: ach.awardHonor,
                    });
                    playTempleBell();
                  }}
                >
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                  {/* Top Left: Award Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#800000] to-[#b30000] text-amber-200 font-bold text-[11px] border border-amber-400/60 shadow-xl flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    <span>{ach.awardHonor}</span>
                  </div>

                  {/* Top Right: Fullscreen hint */}
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-amber-300 border border-amber-500/30 opacity-80 group-hover:opacity-100 transition">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-amber-200/90 font-medium">
                    <span className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300 font-bold">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {ach.team}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black text-[10px] border border-amber-400/40">
                      YEAR {ach.year}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <h3 className="font-heading font-black text-lg sm:text-xl text-[#FFFDF5] group-hover:text-amber-300 transition leading-snug">
                    {ach.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Key Highlight Ribbon */}
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200/90">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Seva Highlight: </span>
                      {ach.keyHighlight}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags & Action Bar */}
              <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {ach.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 text-[10px] font-medium border border-amber-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setLightboxData({
                      url: ach.imageUrl,
                      title: ach.title,
                      subtitle: ach.team,
                      award: ach.awardHonor,
                    });
                    playTempleBell();
                  }}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition"
                >
                  <span>View High-Res Photo</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Gallery Filter Tabs & Moments Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Divine Glimpses
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Festival Moments Gallery
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  playTempleBell();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#800000] text-amber-200 border border-amber-400 shadow-md'
                    : 'bg-black/40 text-amber-100/70 border border-amber-500/20 hover:text-amber-200 hover:bg-black/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setLightboxData({
                  url: item.imageUrl,
                  title: item.title,
                  subtitle: item.timeTag,
                });
                playTempleBell();
              }}
              className="rounded-2xl overflow-hidden border border-amber-500/30 bg-[#160b0b] shadow-xl group cursor-pointer hover:border-amber-400 transition"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                  {item.timeTag}
                </div>

                {item.is4k && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#800000] text-amber-200 font-black text-[10px] border border-amber-400/50">
                    4K MASTER
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-amber-200/90 font-medium">
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Camera className="w-3 h-3 text-amber-400" />
                    {item.photoCount} Photos
                  </span>
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Eye className="w-3 h-3 text-amber-400" />
                    {item.views.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-heading font-bold text-base text-[#FFFDF5] group-hover:text-amber-300 transition">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Historical Idol Vault & Pandal Themes (1999 to 2026) */}
      <section className="rounded-3xl temple-glass p-6 sm:p-10 border-2 border-amber-500/30 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Heritage Retrospective</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Historical Idol Vault & Pandal Themes (1999 – 2026)
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
              Every year features a distinctive murti posture, authentic Vedic pandal architecture, and certified eco-friendly materials.
            </p>
          </div>

          {/* Year Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedVaultYear(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedVaultYear === null
                  ? 'bg-amber-400 text-black'
                  : 'bg-black/50 text-amber-200 border border-amber-500/30'
              }`}
            >
              All Years
            </button>
            {HISTORICAL_VAULT.map((v) => (
              <button
                key={v.year}
                onClick={() => setSelectedVaultYear(v.year)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedVaultYear === v.year
                    ? 'bg-[#800000] text-amber-200 border border-amber-400'
                    : 'bg-black/50 text-amber-200 border border-amber-500/30'
                }`}
              >
                {v.year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVault.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#1a0c0c] border border-amber-500/30 overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.themeTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#800000] text-amber-200 font-black text-xs border border-amber-400/50 shadow-md">
                    Year {item.year}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#FFFDF5]">
                      {item.themeTitle}
                    </h3>
                    <p className="text-xs text-amber-200/80 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-amber-500/20 text-xs">
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">Idol Dimensions:</span>
                      <span className="font-bold text-amber-300">{item.idolHeight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">Mandapam Style:</span>
                      <span className="font-bold text-amber-100">{item.mandapamStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">Head Sculptor:</span>
                      <span className="font-bold text-amber-100">{item.headSculptor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Sacred Sponsor Wall & Benefactors */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Devotee Gratitude
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5]">
              Sacred Sponsor Wall & Benefactors
            </h2>
            <p className="text-xs text-amber-200/70 mt-1">
              Honoring the generous patrons who support Vedic rituals, Annadanam, and the Silver Jubilee celebrations.
            </p>
          </div>

          <button
            id="sponsor-wall-join-btn"
            onClick={() => setIsSponsorModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-lg border border-amber-300 transition"
          >
            Become a Festival Patron →
          </button>
        </div>

        {/* 3 Tiers of Sponsors */}
        <div className="space-y-6">
          {/* Tier 1: Maha Raja Poshakulu */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#800000]/60 via-[#2d0000]/80 to-[#120000] border-2 border-amber-400/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                <h3 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wider">
                  Maha Raja Poshakulu (Grand Temple Patrons)
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-300/80">Gold Tier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SPONSORS.filter((s) => s.tier === 'Maha Raja Poshakulu').map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-xl bg-black/40 border border-amber-500/40 space-y-1"
                >
                  <p className="font-heading font-bold text-sm text-[#FFFDF5]">{sp.name}</p>
                  <p className="text-xs text-amber-200/70">{sp.subtitle}</p>
                  <span className="inline-block text-[11px] font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded mt-1">
                    {sp.sevaSponsored}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 2: Raja Poshakulu */}
          <div className="p-6 rounded-2xl temple-glass border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-heading font-bold text-base text-amber-200 uppercase tracking-wider">
                  Raja Poshakulu (Silver Trim)
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-200/70">Silver Tier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SPONSORS.filter((s) => s.tier === 'Raja Poshakulu').map((sp) => (
                <div
                  key={sp.id}
                  className="p-3.5 rounded-xl bg-black/30 border border-amber-500/20 space-y-1"
                >
                  <p className="font-heading font-bold text-sm text-[#FFFDF5]">{sp.name}</p>
                  <p className="text-xs text-amber-200/70">{sp.subtitle}</p>
                  <span className="inline-block text-[11px] font-medium text-amber-300">
                    {sp.sevaSponsored}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 3: Seva Daathalu */}
          <div className="p-6 rounded-2xl temple-glass border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <h3 className="font-heading font-bold text-sm text-amber-200 uppercase tracking-wider">
                  Seva Daathalu (Community Stewards)
                </h3>
              </div>
              <span className="text-xs text-amber-200/70">Bronze Tier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SPONSORS.filter((s) => s.tier === 'Seva Daathalu').map((sp) => (
                <div
                  key={sp.id}
                  className="p-3 rounded-xl bg-black/20 border border-amber-500/15 space-y-1"
                >
                  <p className="font-bold text-xs text-[#FFFDF5]">{sp.name}</p>
                  <p className="text-[11px] text-amber-200/70">{sp.subtitle}</p>
                  <p className="text-[10px] text-amber-300">{sp.sevaSponsored}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxData(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-[#140606] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image display */}
            <div className="relative flex-1 max-h-[72vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={lightboxData.url}
                alt={lightboxData.title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto max-w-full object-contain mx-auto"
              />
              <button
                onClick={() => setLightboxData(null)}
                aria-label="Close Lightbox"
                className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-amber-300 hover:text-white border border-amber-500/50 shadow-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2a0808] to-[#120000] border-t border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                {lightboxData.award && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#800000] text-amber-200 text-xs font-bold border border-amber-400/50">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lightboxData.award}</span>
                  </div>
                )}
                <h4 className="font-heading font-bold text-base sm:text-lg text-[#FFFDF5]">
                  {lightboxData.title}
                </h4>
                {lightboxData.subtitle && (
                  <p className="text-xs text-amber-200/80">{lightboxData.subtitle}</p>
                )}
              </div>

              <button
                onClick={() => setLightboxData(null)}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-amber-400 text-black font-heading font-bold text-xs hover:bg-amber-300 transition shrink-0"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Seva Modal */}
      <DonationModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
      />
    </div>
  );
};
