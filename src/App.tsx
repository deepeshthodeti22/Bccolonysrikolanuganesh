import React, { useState } from 'react';
import { FestivalProvider, useFestival } from './context/FestivalContext';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { GamesPage } from './pages/GamesPage';
import { AdminPage } from './pages/AdminPage';
import { BackendArchitecturePage } from './pages/BackendArchitecturePage';
import { PrasadBookingModal } from './components/PrasadBookingModal';
import { DonationModal } from './components/DonationModal';
import { Sparkles, Heart } from 'lucide-react';

function FestivalAppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isPrasadModalOpen, setIsPrasadModalOpen] = useState<boolean>(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const { playTempleBell } = useFestival();

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    playTempleBell();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#FFFDF5] flex flex-col selection:bg-[#FFBF00] selection:text-[#800000]">
      {/* 1. Scrolling News Ticker */}
      <LiveTicker />

      {/* 2. Temple Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        onOpenPrasadModal={() => setIsPrasadModalOpen(true)}
        onOpenDonationModal={() => setIsDonationModalOpen(true)}
      />

      {/* 3. Dynamic Page View Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={handlePageChange}
            onOpenPrasadModal={() => setIsPrasadModalOpen(true)}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
          />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'games' && <GamesPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'backend' && <BackendArchitecturePage />}
      </main>

      {/* 4. Global Modals */}
      <PrasadBookingModal
        isOpen={isPrasadModalOpen}
        onClose={() => setIsPrasadModalOpen(false)}
      />

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />

      {/* 5. Floating Quick Action Buttons (Mobile Friendly) */}
      <aside aria-label="Quick Seva Actions" className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 sm:hidden">
        <button
          onClick={() => setIsPrasadModalOpen(true)}
          aria-label="Book Prasad Token"
          className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center justify-center shadow-2xl border-2 border-amber-300"
          title="Book Prasad Token"
        >
          <Sparkles className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsDonationModalOpen(true)}
          aria-label="Offer Seva Donation"
          className="w-12 h-12 rounded-full bg-[#800000] text-amber-200 flex items-center justify-center shadow-2xl border-2 border-amber-400"
          title="Offer Seva Donation"
        >
          <Heart className="w-6 h-6 fill-amber-300 text-amber-300" />
        </button>
      </aside>

      {/* 6. Sacred Temple Footer */}
      <Footer setCurrentPage={handlePageChange} />
    </div>
  );
}

export default function App() {
  return (
    <FestivalProvider>
      <FestivalAppContent />
    </FestivalProvider>
  );
}
