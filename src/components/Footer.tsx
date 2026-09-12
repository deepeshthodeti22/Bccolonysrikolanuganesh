import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer id="temple-portal-footer" className="bg-[#0c0707] border-t-2 border-[#D4AF37]/30 text-amber-100/80 pt-12 pb-8 relative overflow-hidden">
      {/* Decorative top pattern */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Sanskrit Inscription Banner */}
        <div className="text-center max-w-3xl mx-auto p-6 rounded-2xl temple-glass-crimson border border-amber-500/30 shadow-xl">
          <div className="flex justify-center items-center gap-2 text-amber-300 text-sm mb-2">
            <span>✦</span>
            <span className="font-decorative uppercase tracking-widest text-xs">Maha Ganesha Mangalam</span>
            <span>✦</span>
          </div>
          <p className="font-heading text-lg sm:text-xl font-bold text-[#FFFDF5] leading-relaxed">
            वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />
            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
          </p>
          <p className="text-xs text-amber-200/80 mt-2 italic">
            "May the divine Lord of the curved trunk and immense brilliance eliminate all obstacles in all our noble undertakings."
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About the Utsav */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#800000] border border-amber-400 flex items-center justify-center text-sm">
                🕉️
              </div>
              <h4 className="font-heading font-bold text-base text-[#FFFDF5]">
                B.C. Colony Utsav
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-amber-200/70">
              Celebrating 25 Glorious Years (1999–2026) of unbroken spiritual devotion, Vedic tradition, community empowerment, and eco-friendly celebrations in Srikolanu.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300 font-bold bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Silver Jubilee Celebrations</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-amber-300 uppercase tracking-wider">
              Sacred Portals
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home & Live Darshan' },
                { id: 'about', label: 'About & Mythological History' },
                { id: 'events', label: 'Rituals & 10-Day Itinerary' },
                { id: 'gallery', label: 'Visual Gallery & Idol Vault' },
                { id: 'games', label: 'Tournament Leaderboard & Games' },
                { id: 'admin', label: 'Committee Admin Ops Portal' },
                { id: 'backend', label: 'Django REST & n8n Architecture' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentPage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <span className="text-amber-500">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Mandapam Location */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-amber-300 uppercase tracking-wider">
              Mandapam Sanctum
            </h4>
            <div className="text-xs space-y-2 text-amber-200/75">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Sri Vinayaka Pandal, Main Center, B.C. Colony, Srikolanu Village, Kakinada District, Andhra Pradesh - 533433.
                </span>
              </p>
              <p className="text-[11px] text-amber-300/80">
                Landmark: Near Zilla Parishad High School & Village Community Hall
              </p>
            </div>
            <div className="pt-1">
              <a
                href="https://maps.google.com/?q=Srikolanu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 underline underline-offset-4 hover:text-amber-200"
              >
                Open in Google Maps Navigation →
              </a>
            </div>
          </div>

          {/* Col 4: Committee 24/7 Helplines */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-amber-300 uppercase tracking-wider">
              Committee Helplines
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-100 font-semibold">President: +91 9381264690</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-100 font-semibold">Gen Secretary: +91 8688297114</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-100 font-semibold">Treasurer: +91 9848022334</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-100 font-semibold">Security Ops: +91 9912106189</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Public Audit & Transparency */}
        <div className="border-t border-amber-500/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>
              100% Public Audit & Verified Seva Ledger • Audited by Srikolanu Elders Council
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted with sacred devotion</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for B.C. Colony Sri Vinayaka Youth Society</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
