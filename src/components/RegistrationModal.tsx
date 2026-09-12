import React, { useState } from 'react';
import { X, CheckCircle, Trophy, Ticket, Calendar, MapPin } from 'lucide-react';
import { useFestival, CompetitionRegistration } from '../context/FestivalContext';
import confetti from 'canvas-confetti';

interface RegModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCompId?: string;
}

export const RegistrationModal: React.FC<RegModalProps> = ({
  isOpen,
  onClose,
  defaultCompId,
}) => {
  const { competitions, registerForCompetition } = useFestival();
  const [selectedCompId, setSelectedCompId] = useState(
    defaultCompId || competitions?.[0]?.id || ''
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wardStreet, setWardStreet] = useState('');
  const [category, setCategory] = useState('Standard Entry');
  const [pass, setPass] = useState<CompetitionRegistration | null>(null);

  if (!isOpen) return null;

  const currentComp = competitions.find((c) => c.id === selectedCompId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newPass = registerForCompetition(
      selectedCompId,
      name,
      phone,
      wardStreet || 'B.C. Colony',
      category
    );
    setPass(newPass);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFBF00', '#D4AF37', '#800000'],
    });
  };

  const handleReset = () => {
    setPass(null);
    setName('');
    setPhone('');
    setWardStreet('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="competition-reg-modal"
        className="relative w-full max-w-lg rounded-2xl temple-glass border-2 border-amber-500/40 p-6 md:p-8 shadow-2xl my-8 text-[#FFFDF5]"
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-black/40 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!pass ? (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Festival Cultural & Sports Arena</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5]">
                Competition Registration
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                Participate in sacred cultural events, showcase your talents, and win grand festival awards!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Competition Picker */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Choose Tournament / Event
                </label>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0e0e] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  {competitions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Prize: {c.firstPrize})
                    </option>
                  ))}
                </select>
              </div>

              {currentComp && (
                <div className="p-3 rounded-xl bg-[#1f0d0d] border border-amber-500/30 text-xs space-y-1">
                  <p className="text-amber-200 font-semibold">{currentComp.description}</p>
                  <div className="flex flex-wrap gap-2 text-amber-400/90 pt-1">
                    <span>📅 {currentComp.date}</span>
                    <span>📍 {currentComp.venue}</span>
                    <span className="text-amber-300 font-bold">🏆 {currentComp.firstPrize}</span>
                  </div>
                </div>
              )}

              {/* Participant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Participant / Captain Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. S. Sandeep Kumar"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 93984..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Ward / Street / Colony
                  </label>
                  <input
                    type="text"
                    value={wardStreet}
                    onChange={(e) => setWardStreet(e.target.value)}
                    placeholder="e.g. B.C. Colony Lane 3"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Age / Team Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a0e0e] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="Junior Division (<15 yrs)">Junior Division (&lt;15 yrs)</option>
                    <option value="Senior Division (16+ yrs)">Senior Division (16+ yrs)</option>
                    <option value="Colony Team (Open)">Colony Team (Open)</option>
                    <option value="Women Special Wing">Women Special Wing</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="confirm-competition-reg-btn"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-sm hover:brightness-110 shadow-lg border border-amber-300 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Confirm Entry & Issue Digital Pass</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Issued Pass */
          <div id="issued-competition-pass" className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-400 text-green-400 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Official Entry Confirmed
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5] mt-1">
                Tournament Entry Pass
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#200c0c] border-2 border-dashed border-amber-400/50 shadow-inner text-left space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">
                    Registration No
                  </span>
                  <span className="font-mono text-lg font-extrabold text-amber-300">
                    {pass.regId}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-amber-200/70 block">Participant / Team:</span>
                  <span className="font-bold text-[#FFFDF5]">{pass.participantName}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Tournament:</span>
                  <span className="font-bold text-amber-300">{pass.competitionName}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Category:</span>
                  <span className="text-amber-100">{pass.category}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Ward:</span>
                  <span className="text-amber-100">{pass.wardStreet}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Please arrive 30 mins prior to the event time with this pass at the registration desk.
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-black/50 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-black/80"
              >
                Print Pass
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-[#800000] border border-amber-400 text-amber-200 text-xs font-bold hover:bg-[#900000]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
