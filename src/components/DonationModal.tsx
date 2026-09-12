import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Download, Flame, Heart, QrCode } from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import { DonationRecord } from '../types';
import confetti from 'canvas-confetti';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [101, 251, 501, 1116, 2516, 5116];

const SEVA_OPTIONS = [
  'Swarna Pushpa Alankaram & Deepam Seva',
  'Maha Annadanam (Devotee Holy Feast)',
  'Daily Pure Cow Ghee Abhishekam',
  '1008 Sahasra Modak Maha Homam',
  'Silver Jubilee Mandapam Cultural Stage',
  'Eco-Clay Ganesha & Green Nimajjanam Drive',
];

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const { recordDevoteeSevaOffering, playTempleBell } = useFestival();
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState('');
  const [village, setVillage] = useState('Srikolanu');
  const [sevaType, setSevaType] = useState(SEVA_OPTIONS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'HAND CASH' | 'BANK NEFT'>('UPI');
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);

  if (!isOpen) return null;

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || amount <= 0) return;

    const record = recordDevoteeSevaOffering(donorName, amount, sevaType, village, paymentMethod);
    setReceipt(record);
    playTempleBell();

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFBF00', '#D4AF37', '#800000', '#FFFDF5'],
    });
  };

  const handleReset = () => {
    setReceipt(null);
    setDonorName('');
    setCustomAmount('');
    setAmount(501);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        id="donation-seva-modal"
        className="relative w-full max-w-lg rounded-2xl temple-glass border-2 border-amber-500/40 p-6 md:p-8 shadow-2xl my-8 text-[#FFFDF5]"
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-black/40 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!receipt ? (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#800000] border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Sacred Devotee Offering</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5]">
                Pooja Seva & Sacred Contribution
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                Dedicated directly to daily Vedic rituals, Annadanam holy feast, and temple alankaram.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Select Auspicious Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => handlePresetClick(val)}
                      className={`py-2 px-3 rounded-xl font-heading font-bold text-sm border transition ${
                        amount === val && !customAmount
                          ? 'bg-amber-400 text-black border-amber-300 shadow-md scale-102'
                          : 'bg-black/40 text-amber-200 border-amber-500/30 hover:border-amber-400'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Or enter custom amount in ₹"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Seva Type */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Dedicate To Sacred Seva
                </label>
                <select
                  value={sevaType}
                  onChange={(e) => setSevaType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0e0e] border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  {SEVA_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Devotee Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Donor / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Ch. Narayana & Family"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Srikolanu / Kakinada"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'HAND CASH', 'BANK NEFT'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        paymentMethod === method
                          ? 'bg-[#800000] text-amber-200 border-amber-400'
                          : 'bg-black/40 text-amber-100/70 border-amber-500/20'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-amber-400" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-300">UPI VPA: srivinayaka@sbi</p>
                      <p className="text-amber-200/70">Instant confirmation & verified receipt</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                    GPay/PhonePe
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="submit-donation-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-[#121212] font-heading font-bold text-base hover:brightness-110 shadow-xl border border-amber-300 flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-red-900 fill-red-900" />
                <span>Offer Sacred Contribution (₹{amount})</span>
              </button>
            </form>
          </div>
        ) : (
          /* Official Verified Receipt Card */
          <div id="verified-donation-receipt" className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-400 text-green-400 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Offering Acknowledged
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5] mt-1">
                Official Temple E-Receipt
              </h3>
            </div>

            {/* Receipt Box */}
            <div className="p-6 rounded-2xl bg-[#1e0e0e] border-2 border-amber-500/40 shadow-inner text-left space-y-4 relative">
              {/* Watermark seal */}
              <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none font-heading text-7xl font-extrabold text-amber-300">
                卐
              </div>

              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div>
                  <p className="text-[11px] text-amber-300/80 font-bold uppercase">
                    Sri Vinayaka Utsav Committee • Srikolanu
                  </p>
                  <p className="text-xs text-amber-200/60 font-mono">
                    Receipt ID: {receipt.txnId}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-950/60 px-2.5 py-1 rounded-full border border-green-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Public Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-amber-200/70 block">Donor Name:</span>
                  <span className="font-bold text-base text-[#FFFDF5]">{receipt.donorName}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Village / Origin:</span>
                  <span className="font-bold text-sm text-[#FFFDF5]">{receipt.village}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Seva Dedicated:</span>
                  <span className="font-bold text-xs text-amber-300">{receipt.sevaType}</span>
                </div>
                <div>
                  <span className="text-amber-200/70 block">Amount Blessed:</span>
                  <span className="font-heading font-extrabold text-xl text-amber-300">
                    ₹{(receipt.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-amber-500/20 pt-3 flex items-center justify-between text-[11px] text-amber-200/70">
                <span>Method: {receipt.paymentMethod}</span>
                <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-black/50 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-black/80 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save E-Receipt</span>
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-[#800000] border border-amber-400 text-amber-200 text-xs font-bold hover:bg-[#900000]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
