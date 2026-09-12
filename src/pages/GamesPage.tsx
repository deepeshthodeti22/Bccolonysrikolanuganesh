import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Gamepad2,
  CheckCircle,
  Play,
  RotateCcw,
  Volume2,
  Calendar,
  Users,
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';
import { RegistrationModal } from '../components/RegistrationModal';
import confetti from 'canvas-confetti';

const QUIZ_QUESTIONS = [
  {
    q: "What is Lord Ganesha's sacred vahana (divine celestial mount)?",
    options: ['Mushika (The Mouse)', 'Garuda (The Eagle)', 'Nandi (The Bull)', 'Mayura (The Peacock)'],
    answer: 0,
    fact: 'Lord Ganesha rides Mushika, signifying mastery over ego and subtle desires.',
  },
  {
    q: 'Why is Lord Ganesha called "Ekadanta"?',
    options: ['He broke a tusk to write Mahabharata', 'Born with a single tooth', 'Won it in a battle', 'Bestowed by Kubera'],
    answer: 0,
    fact: 'He broke his right tusk to continue transcribing the Mahabharata dictated by Sage Vyasa.',
  },
  {
    q: 'Which sacred sweet is considered most dear to Lord Vighneshwara?',
    options: ['Modak / Undrallu', 'Jalebi', 'Rasgulla', 'Gulab Jamun'],
    answer: 0,
    fact: 'Modak represents the sweet divine bliss (Ananda) of supreme spiritual wisdom.',
  },
  {
    q: 'Which leaf (Patra) is considered exceedingly sacred in Ganesha 21-Patra Pooja?',
    options: ['Durva (Garika Grass)', 'Tulasi (strictly avoided in regular puja)', 'Neem leaf', 'Peepal leaf'],
    answer: 0,
    fact: 'Offering 21 blades of Durva grass brings peace and cools all cosmic heat.',
  },
  {
    q: 'In which Telugu/Hindu lunar month is Ganesh Chaturthi celebrated?',
    options: ['Bhadrapada Masam', 'Karthika Masam', 'Chaitra Masam', 'Sravana Masam'],
    answer: 0,
    fact: 'Celebrated on Bhadrapada Sukla Chavithi with great devotion across India.',
  },
];

export const GamesPage: React.FC = () => {
  const { sportsData, leaderboard: contextLeaderboard, liveMatch: contextLiveMatch, playTempleBell } = useFestival();
  const fallbackLiveMatch = {
    tournament: 'B.C. Colony Youth Kabaddi Cup',
    team1: 'Srikolanu Warriors',
    team1Score: 32,
    team2: 'Godavari Panthers',
    team2Score: 28,
    half: '2nd Half - 8 Mins Left',
    court: 'Mandapam Ground Court A',
    lastUpdatedBy: 'Youth Committee Referees',
    status: 'LIVE',
  };
  const leaderboard = contextLeaderboard || sportsData?.leaderboard || [];
  const liveMatch = contextLiveMatch || sportsData?.liveMatch || fallbackLiveMatch;

  const [selectedSport, setSelectedSport] = useState('all');
  const [activeTab, setActiveTab] = useState<'tournament' | 'quiz' | 'arcade'>('tournament');
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Modak Arcade Game State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [modakScore, setModakScore] = useState(0);
  const [modakLives, setModakLives] = useState(3);
  const [highScore, setHighScore] = useState(120);

  const sportsFilterList = [
    { id: 'all', label: 'All Tournament Standings' },
    { id: 'kabaddi', label: 'Traditional Kabaddi' },
    { id: 'tug', label: 'Inter-Street Tug of War' },
    { id: 'rangoli', label: 'Rangoli / Muggulu' },
    { id: 'cooking', label: 'Modak Speed Cooking' },
  ];

  const filteredLeaderboard =
    selectedSport === 'all'
      ? leaderboard
      : (leaderboard || []).filter((entry) => {
          if (selectedSport === 'kabaddi') return entry.category?.toLowerCase().includes('kabaddi');
          if (selectedSport === 'tug') return entry.category?.toLowerCase().includes('tug');
          if (selectedSport === 'rangoli') return entry.category?.toLowerCase().includes('rangoli');
          if (selectedSport === 'cooking') return entry.category?.toLowerCase().includes('modak');
          return true;
        });

  // Top 3 Podium
  const rank1 = leaderboard?.[0];
  const rank2 = leaderboard?.[1];
  const rank3 = leaderboard?.[2];

  // Quiz Handlers
  const handleAnswerSelect = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === QUIZ_QUESTIONS[currentQIndex].answer;
    if (isCorrect) {
      setQuizScore((s) => s + 1);
      playTempleBell();
    }

    setTimeout(() => {
      if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsQuizFinished(true);
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FFBF00', '#D4AF37', '#800000'],
        });
      }
    }, 1200);
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setIsQuizFinished(false);
  };

  // Catch Modak Arcade Engine
  useEffect(() => {
    if (!gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let basketX = canvas.width / 2 - 35;
    const basketWidth = 70;
    const basketHeight = 16;
    let items: Array<{ x: number; y: number; speed: number; isModak: boolean }> = [];
    let localScore = 0;
    let localLives = 3;

    // Handle mouse/touch movement
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = ('touches' in e && e.touches?.[0]) ? e.touches[0].clientX : ('clientX' in e ? e.clientX : 0);
      const x = clientX - rect.left;
      basketX = Math.max(0, Math.min(canvas.width - basketWidth, x - basketWidth / 2));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    let spawnTimer = 0;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw starry temple background
      ctx.fillStyle = '#140a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn modaks / obstacles
      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        items.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: 0,
          speed: 2.8 + Math.random() * 2.2,
          isModak: Math.random() > 0.25, // 75% modak, 25% stone obstacle
        });
      }

      // Draw Basket
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(basketX, canvas.height - basketHeight - 10, basketWidth, basketHeight);
      ctx.fillStyle = '#FFBF00';
      ctx.fillRect(basketX + 5, canvas.height - basketHeight - 8, basketWidth - 10, 4);

      // Update and Draw Falling items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        // Draw item
        if (item.isModak) {
          // Modak (Golden flame dumpling)
          ctx.beginPath();
          ctx.arc(item.x, item.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = '#FFBF00';
          ctx.fill();
          ctx.strokeStyle = '#800000';
          ctx.stroke();

          // Modak tip
          ctx.beginPath();
          ctx.moveTo(item.x - 7, item.y - 4);
          ctx.lineTo(item.x, item.y - 16);
          ctx.lineTo(item.x + 7, item.y - 4);
          ctx.fillStyle = '#FFF5C0';
          ctx.fill();
        } else {
          // Obstacle Stone
          ctx.fillStyle = '#666';
          ctx.fillRect(item.x - 8, item.y - 8, 16, 16);
        }

        // Collision detection with basket
        if (
          item.y >= canvas.height - basketHeight - 20 &&
          item.y <= canvas.height - 10 &&
          item.x >= basketX &&
          item.x <= basketX + basketWidth
        ) {
          if (item.isModak) {
            localScore += 10;
            setModakScore(localScore);
          } else {
            localLives -= 1;
            setModakLives(localLives);
            if (localLives <= 0) {
              setGameRunning(false);
              setHighScore((prev) => Math.max(prev, localScore));
              return;
            }
          }
          items.splice(i, 1);
          continue;
        }

        // Missed modak
        if (item.y > canvas.height) {
          if (item.isModak) {
            localLives -= 1;
            setModakLives(localLives);
            if (localLives <= 0) {
              setGameRunning(false);
              setHighScore((prev) => Math.max(prev, localScore));
              return;
            }
          }
          items.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [gameRunning]);

  const startArcadeGame = () => {
    setModakScore(0);
    setModakLives(3);
    setGameRunning(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-[#FFFDF5]">
      {/* 1. Header & Live Kabaddi Match Banner */}
      <section className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Village Championship & Devotional Gaming Arena</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#FFFDF5] leading-tight">
          Tournament Scores & <span className="gold-gradient-text">Festive Games</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed">
          Follow live standings of traditional village kabaddi, tug-of-war, and muggulu competitions, or test your wisdom in the Ganesha Puranic Quiz and Modak arcade challenge.
        </p>

        {/* Live Kabaddi Scoreboard Widget */}
        <div className="rounded-2xl p-5 sm:p-6 temple-glass-crimson border-2 border-amber-400/50 shadow-2xl text-left flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                LIVE SCOREBOARD • {liveMatch.court}
              </span>
            </div>
            <p className="text-xs text-amber-200/70">{liveMatch.half} • Scorer: {liveMatch.lastUpdatedBy}</p>
          </div>

          {/* Teams Score Clash */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="text-right">
              <span className="font-heading font-bold text-sm sm:text-base text-[#FFFDF5] block">
                {liveMatch.team1}
              </span>
              <span className="text-[11px] text-amber-300">Ward 1</span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-xl border border-amber-500/40">
              <span className="font-heading text-2xl sm:text-3xl font-black text-amber-300">
                {liveMatch.team1Score}
              </span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="font-heading text-2xl sm:text-3xl font-black text-amber-300">
                {liveMatch.team2Score}
              </span>
            </div>

            <div className="text-left">
              <span className="font-heading font-bold text-sm sm:text-base text-[#FFFDF5] block">
                {liveMatch.team2}
              </span>
              <span className="text-[11px] text-amber-300">East Street</span>
            </div>
          </div>

          <button
            onClick={() => setIsRegModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-md border border-amber-300 whitespace-nowrap"
          >
            Register Colony Team →
          </button>
        </div>
      </section>

      {/* 2. Interactive Arena Mode Navigation */}
      <section className="space-y-6">
        <div className="flex justify-center border-b border-amber-500/20 pb-4">
          <div className="inline-flex p-1.5 rounded-2xl bg-black/50 border border-amber-500/30 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('tournament')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'tournament'
                  ? 'bg-[#800000] text-amber-200 border border-amber-400 shadow-md'
                  : 'text-amber-100/70 hover:text-amber-200'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Village Standings & Podium</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-[#800000] text-amber-200 border border-amber-400 shadow-md'
                  : 'text-amber-100/70 hover:text-amber-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Mythology Quiz Challenge</span>
            </button>

            <button
              onClick={() => setActiveTab('arcade')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'arcade'
                  ? 'bg-[#800000] text-amber-200 border border-amber-400 shadow-md'
                  : 'text-amber-100/70 hover:text-amber-200'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Catch the Modak Arcade</span>
            </button>
          </div>
        </div>

        {/* TAB 1: TOURNAMENT LEADERBOARD & PODIUM */}
        {activeTab === 'tournament' && (
          <div className="space-y-12">
            {/* 3D-Style Podium Display */}
            <div className="max-w-3xl mx-auto pt-6">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Current Top Ranking Teams
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#FFFDF5]">
                  Championship Podium
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end text-center">
                {/* 2nd Place (Silver) */}
                {rank2 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-400/20 border-2 border-slate-300 flex items-center justify-center font-bold text-slate-200 text-lg mb-2 shadow-lg">
                      🥈
                    </div>
                    <div className="w-full bg-[#1c0e0e] border border-slate-400/40 rounded-t-2xl p-4 h-44 flex flex-col justify-between shadow-xl">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-300">2nd Place</span>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#FFFDF5] mt-1 line-clamp-1">
                          {rank2.teamName}
                        </h4>
                        <p className="text-[10px] text-amber-200/60">{rank2.category}</p>
                      </div>
                      <div>
                        <span className="font-heading font-black text-xl text-amber-300 block">
                          {rank2.points} Pts
                        </span>
                        <span className="text-[9px] text-amber-200/70">{rank2.rewardTier}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place (Gold Champion) */}
                {rank1 && (
                  <div className="flex flex-col items-center -mt-6">
                    <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center font-bold text-amber-300 text-2xl mb-2 shadow-2xl animate-bounce">
                      👑
                    </div>
                    <div className="w-full bg-gradient-to-t from-[#800000] to-[#500000] border-2 border-amber-400 rounded-t-2xl p-4 h-56 flex flex-col justify-between shadow-2xl">
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                          🥇 Champion
                        </span>
                        <h4 className="font-heading font-black text-sm sm:text-base text-amber-100 mt-1 line-clamp-1">
                          {rank1.teamName}
                        </h4>
                        <p className="text-[11px] text-amber-200/80">{rank1.category}</p>
                      </div>
                      <div className="border-t border-amber-400/30 pt-2">
                        <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 block">
                          {rank1.points} Pts
                        </span>
                        <span className="text-[10px] font-bold text-amber-200">{rank1.rewardTier}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Bronze) */}
                {rank3 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-700/20 border-2 border-amber-600 flex items-center justify-center font-bold text-amber-400 text-lg mb-2 shadow-lg">
                      🥉
                    </div>
                    <div className="w-full bg-[#1c0e0e] border border-amber-700/40 rounded-t-2xl p-4 h-36 flex flex-col justify-between shadow-xl">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-500">3rd Place</span>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#FFFDF5] mt-1 line-clamp-1">
                          {rank3.teamName}
                        </h4>
                        <p className="text-[10px] text-amber-200/60">{rank3.category}</p>
                      </div>
                      <div>
                        <span className="font-heading font-black text-lg text-amber-300 block">
                          {rank3.points} Pts
                        </span>
                        <span className="text-[9px] text-amber-200/70">{rank3.rewardTier}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Standings Table with Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                <h3 className="font-heading text-xl font-bold text-[#FFFDF5]">
                  Official Tournament Standings
                </h3>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {sportsFilterList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSport(s.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                        selectedSport === s.id
                          ? 'bg-[#800000] text-amber-200 border border-amber-400'
                          : 'bg-black/40 text-amber-100/70 border border-amber-500/20 hover:text-amber-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl temple-glass border border-amber-500/30 overflow-x-auto shadow-2xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#200d0d] border-b border-amber-500/30 text-amber-300 uppercase font-bold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Team / Mandali</th>
                      <th className="py-3 px-4">Ward / Street</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-center">Played</th>
                      <th className="py-3 px-4 text-center">Won</th>
                      <th className="py-3 px-4 text-right">Points</th>
                      <th className="py-3 px-4 text-center">Match Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/15">
                    {filteredLeaderboard.map((entry) => (
                      <tr
                        key={entry.rank + entry.teamName}
                        className="hover:bg-black/40 transition"
                      >
                        <td className="py-3 px-4 font-heading font-extrabold text-amber-300">
                          #{entry.rank}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#FFFDF5]">
                          {entry.teamName}
                        </td>
                        <td className="py-3 px-4 text-amber-200/75">{entry.wardStreet}</td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] bg-amber-950/70 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                            {entry.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-amber-200/80">{entry.matchesPlayed}</td>
                        <td className="py-3 px-4 text-center text-green-400 font-bold">{entry.matchesWon}</td>
                        <td className="py-3 px-4 text-right font-heading font-black text-amber-300 text-base">
                          {entry.points}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              entry.matchStatus.includes('Live')
                                ? 'bg-red-950 text-red-300 border border-red-500/40 animate-pulse'
                                : 'bg-black/50 text-amber-200/80 border border-amber-500/20'
                            }`}
                          >
                            {entry.matchStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MYTHOLOGY QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl space-y-6">
            {!isQuizFinished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                      Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-[#FFFDF5] mt-1">
                      Divine Wisdom Test
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-300 font-bold">
                      Score: {quizScore} / {QUIZ_QUESTIONS.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1f0d0d] border border-amber-500/30">
                  <p className="font-heading text-base sm:text-lg font-bold text-amber-100">
                    {QUIZ_QUESTIONS[currentQIndex].q}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {QUIZ_QUESTIONS[currentQIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQIndex].answer;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition ${
                          selectedOption === null
                            ? 'bg-black/40 border-amber-500/25 hover:border-amber-400 hover:bg-black/70 text-amber-100'
                            : isCorrect
                            ? 'bg-green-950/80 border-green-400 text-green-200'
                            : isSelected
                            ? 'bg-red-950/80 border-red-400 text-red-200'
                            : 'bg-black/30 border-gray-700 text-gray-400'
                        }`}
                      >
                        <span className="font-mono text-amber-300 mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200">
                    <strong>Sacred Fact:</strong> {QUIZ_QUESTIONS[currentQIndex].fact}
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center text-3xl mx-auto">
                  🕉️
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Spiritual Assessment Completed
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFFDF5] mt-1">
                    Divine Blessings Conferred!
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
                    You answered <strong>{quizScore}</strong> out of{' '}
                    <strong>{QUIZ_QUESTIONS.length}</strong> questions correctly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#200c0c] border border-amber-400/40 text-xs text-amber-300/90 font-decorative italic">
                  "विद्यावान् गुणि अति चातुर । राम काज करिबे को आतुर ॥"
                  <p className="text-[11px] text-amber-200/60 mt-1">
                    May Lord Vighneshwara illuminate your intellect with eternal peace and wisdom.
                  </p>
                </div>

                <button
                  onClick={restartQuiz}
                  className="px-6 py-2.5 rounded-xl bg-[#800000] border border-amber-400 text-amber-200 text-xs font-bold hover:bg-[#900000] flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATCH MODAK ARCADE */}
        {activeTab === 'arcade' && (
          <div className="max-w-xl mx-auto rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl space-y-6 text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Mini Arcade Arena
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#FFFDF5] mt-1">
                Catch the Divine Modak
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Move your mouse or finger across the canvas to slide the Golden Basket. Catch falling modaks (+10 pts) and dodge falling obstacles!
              </p>
            </div>

            {/* Score & Lives bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-amber-500/30 text-xs font-bold">
              <span className="text-amber-300">
                Score: <strong className="text-lg text-[#FFFDF5]">{modakScore}</strong>
              </span>
              <span className="text-amber-200">
                High Score: <strong className="text-amber-400">{highScore}</strong>
              </span>
              <span className="text-red-400">
                Lives: {'❤️'.repeat(Math.max(0, modakLives))}
              </span>
            </div>

            {/* Game Canvas */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-inner bg-[#120a0a]">
              <canvas
                ref={canvasRef}
                width={460}
                height={320}
                className="w-full aspect-4/3 cursor-crosshair block"
              />

              {!gameRunning && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-4">
                  <div className="text-4xl select-none animate-bounce">🍯</div>
                  <h4 className="font-heading text-xl font-bold text-[#FFFDF5]">
                    {modakScore > 0 ? `Game Over! Score: ${modakScore}` : 'Modak Rush Challenge'}
                  </h4>
                  <p className="text-xs text-amber-200/80 max-w-xs">
                    Slide your finger or cursor to guide Lord Ganesha's sacred Modak basket.
                  </p>
                  <button
                    onClick={startArcadeGame}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-lg border border-amber-300 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>{modakScore > 0 ? 'Play Again' : 'Start Challenge'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Team Registration Modal */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
      />
    </div>
  );
};
