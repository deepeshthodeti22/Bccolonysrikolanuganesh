import React, { useState } from 'react';
import { X, CheckCircle, Ticket, QrCode, Sparkles, MapPin } from 'lucide-react';
import { useFestival, PrasadToken } from '../context/FestivalContext';
import confetti from 'canvas-confetti';

interface PrasadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrasadBookingModal: React.FC<PrasadModalProps> = ({ isOpen, onClose }) => {
  const { prasadItems, bookPrasad } = useFestival();
  const [selectedItemId, setSelectedItemId] = useState(prasadItems[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [gotra, setGotra] = useState('');
  const [generatedToken, setGeneratedToken] = useState<PrasadToken | null>(null);

  if (!isOpen) return null;

  const selectedItem = prasadItems.find((p) => p.id === selectedItemId);
  const totalAmount = selectedItem ? selectedItem.price * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim() || !phone.trim()) return;

    const token = bookPrasad(selectedItemId, quantity, devoteeName, phone);
    setGeneratedToken(token);

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFBF00', '#D4AF37', '#800000'],
    });
  };

  const handleReset = () => {
    setGeneratedToken(null);
    setDevoteeName('');
    setPhone('');
    setGotra('');
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="prasad-booking-modal"
        className="relative w-full max-w-lg rounded-2xl temple-glass border-2 border-amber-500/40 p-6 md:p-8 shadow-2xl my-8 text-[#FFFDF5]"
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-black/40 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!generatedToken ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
                Mandapam Seva Desk
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5]">
                Book Holy Prasad & Archana
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                Receive blessed consecrated prasadam at the temple counter or via volunteer delivery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prasad Selection */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Select Seva / Prasad
                </label>
                <div className="space-y-2">
                  {prasadItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedItemId === item.id
                          ? 'bg-[#800000]/60 border-amber-400 shadow-md'
                          : 'bg-black/40 border-amber-500/20 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="prasadItem"
                          checked={selectedItemId === item.id}
                          onChange={() => setSelectedItemId(item.id)}
                          className="accent-amber-400 h-4 w-4"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#FFFDF5]">{item.name}</p>
                          <p className="text-xs text-amber-200/70">{item.description}</p>
                          <p className="text-[11px] text-amber-400/90 mt-0.5 font-medium">
                            {item.availableCount} {item.unit} remaining today
                          </p>
                        </div>
                      </div>
                      <div className="text-right pl-2">
                        <span className="font-heading font-bold text-amber-300 text-base">
                          ₹{item.price}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-amber-500/20">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Quantity / Slots
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-[#800000] border border-amber-500/40 text-amber-200 font-bold hover:bg-[#900000]"
                  >
                    -
                  </button>
                  <span className="font-bold text-base text-amber-300 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-8 h-8 rounded-lg bg-[#800000] border border-amber-500/40 text-amber-200 font-bold hover:bg-[#900000]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Devotee Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Devotee Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Gotram / Nakshatram (For Archana Sankalpam)
                </label>
                <input
                  type="text"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  placeholder="e.g. Kasyapa Gotram • Rohini Nakshatra"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Total & Submit */}
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-200/70 block uppercase font-medium">
                    Total Seva Amount
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-amber-300">
                    ₹{totalAmount}
                  </span>
                </div>

                <button
                  type="submit"
                  id="confirm-prasad-booking-btn"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:brightness-110 shadow-lg border border-amber-300 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Token</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Generated Digital Token Card */
          <div id="prasad-digital-token-card" className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-400 text-green-400 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Token Confirmed & Blessed
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5] mt-1">
                Sacred Prasad Digital Pass
              </h3>
            </div>

            {/* Pass Container */}
            <div className="p-5 rounded-2xl bg-[#200c0c] border-2 border-dashed border-amber-400/50 shadow-inner relative text-left space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">
                    Pass Identifier
                  </span>
                  <span className="font-mono text-lg font-extrabold text-amber-300">
                    {generatedToken.tokenId}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-amber-500/30">
                  <QrCode className="w-10 h-10 text-amber-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-amber-200/70 block">Devotee Name:</span>
                  <span className="font-bold text-[#FFFDF5]">{generatedToken.devoteeName}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Phone:</span>
                  <span className="font-bold text-[#FFFDF5]">{generatedToken.phone}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Prasad Seva:</span>
                  <span className="font-bold text-amber-300">
                    {generatedToken.itemName} (x{generatedToken.quantity})
                  </span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Amount Blessed:</span>
                  <span className="font-bold text-amber-300">₹{generatedToken.totalAmount}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Pickup Counter:</strong> {generatedToken.pickupCounter} (Show this screen to volunteer)
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-black/50 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-black/80 flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>Print / Save Pass</span>
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
