import { useState } from "react";
import { QUESTIONS, type Category } from "@/lib/quizData";
import { Shuffle, List, Landmark } from "lucide-react";

// Design: Ancient excavation site photo background with a warm sepia gradient overlay for readability.
// Layout: RTL Hebrew, title top-center, credits mid-right, mode buttons bottom, CTA center-bottom.

const HERO_BG = `${import.meta.env.BASE_URL}images/hero/tel-megiddo.jpg`;

interface QuizLandingProps {
  onStart: (category: Category, shuffle: boolean) => void;
}

export default function QuizLanding({ onStart }: QuizLandingProps) {
  const [shuffleMode, setShuffleMode] = useState<boolean | null>(null);

  const totalCount = QUESTIONS.length;

  const handleModeSelect = (mode: boolean) => {
    setShuffleMode(mode);
    // Small delay for visual feedback before starting
    setTimeout(() => {
      onStart('הכל', mode);
    }, 180);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ fontFamily: "'Heebo', sans-serif" }}
    >
      {/* Full-screen photo — Tel Megiddo excavation (Wikimedia Commons) */}
      <img
        src={HERO_BG}
        alt="תל מגידו"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ zIndex: 0 }}
      />
      {/* Warm sepia tint over the photo */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: `linear-gradient(180deg,
            rgba(56, 40, 20, 0.3) 0%,
            rgba(66, 46, 24, 0.18) 30%,
            rgba(48, 34, 18, 0.4) 70%,
            rgba(30, 20, 10, 0.68) 100%)`,
        }}
      />
      {/* Vignette for readability */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.2) 0%, transparent 55%),
            radial-gradient(ellipse at 0% 100%, rgba(0,0,0,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.25) 0%, transparent 50%)
          `,
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-10">

        {/* Title — top center, large parchment pill card */}
        <div className="flex justify-center mb-8">
          <div
            className="text-center px-8 py-4 rounded-2xl shadow-lg flex flex-col items-center gap-1"
            style={{
              background: 'rgba(250,242,225,0.94)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)'
            }}
          >
            <Landmark className="w-7 h-7 mb-1" style={{ color: '#5a4022' }} />
            <h1
              className="text-3xl font-black leading-tight"
              style={{
                fontFamily: "'Frank Ruhl Libre', serif",
                color: '#332212',
                textShadow: 'none'
              }}
            >
              תקופות היסטוריות לתעודת מורה דרך
            </h1>
            <p
              className="text-base font-semibold mt-1"
              style={{ color: '#5a4022' }}
            >
              פרהיסטוריה · ארכיאולוגיה · תקופת הברונזה
            </p>
          </div>
        </div>

        {/* Credits — mid-right, smaller pill */}
        <div className="flex justify-end mb-auto">
          <div
            className="px-5 py-3 rounded-2xl shadow-md"
            style={{
              background: 'rgba(250,242,225,0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.18)'
            }}
          >
            <p
              className="text-base font-bold leading-tight"
              style={{ color: '#332212' }}
            >
              תרמיל שאלות חזרה לבחינה
            </p>
            <p
              className="text-xs font-medium mt-0.5"
              style={{ color: '#6e5230' }}
            >
              תיכנת: כפיר משה יעקובי
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Mode buttons + CTA — bottom area */}
        <div className="flex flex-col items-center gap-4">

          {/* Two mode buttons side by side */}
          <div className="flex gap-4 justify-center w-full max-w-sm">
            <button
              onClick={() => handleModeSelect(true)}
              className="flex-1 flex flex-col items-center justify-center py-4 px-4 rounded-2xl shadow-lg transition-all active:scale-95"
              style={{
                background: shuffleMode === true
                  ? 'rgba(90, 64, 34, 0.92)'
                  : 'rgba(250,242,225,0.9)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                color: shuffleMode === true ? 'white' : '#332212',
                border: shuffleMode === true ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                transition: 'all 0.18s cubic-bezier(0.23,1,0.32,1)'
              }}
            >
              <Shuffle className="w-5 h-5 mb-1.5" />
              <span className="font-black text-base" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>
                מעורבב
              </span>
            </button>

            <button
              onClick={() => handleModeSelect(false)}
              className="flex-1 flex flex-col items-center justify-center py-4 px-4 rounded-2xl shadow-lg transition-all active:scale-95"
              style={{
                background: shuffleMode === false
                  ? 'rgba(90, 64, 34, 0.92)'
                  : 'rgba(250,242,225,0.9)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                color: shuffleMode === false ? 'white' : '#332212',
                border: shuffleMode === false ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                transition: 'all 0.18s cubic-bezier(0.23,1,0.32,1)'
              }}
            >
              <List className="w-5 h-5 mb-1.5" />
              <span className="font-black text-base" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>
                לפי סדר נושאים
              </span>
            </button>
          </div>

          {/* Start CTA */}
          <button
            onClick={() => onStart('הכל', shuffleMode ?? false)}
            className="w-full max-w-sm py-4 rounded-2xl text-white font-black text-xl shadow-xl transition-all active:scale-[0.97]"
            style={{
              background: 'rgba(66, 46, 24, 0.92)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              fontFamily: "'Frank Ruhl Libre', serif",
              letterSpacing: '0.03em',
              border: '1.5px solid rgba(255,255,255,0.18)',
              transition: 'all 0.18s cubic-bezier(0.23,1,0.32,1)'
            }}
          >
            התחל לתרגל! ←
          </button>

          <p
            className="text-xs font-semibold text-center"
            style={{
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)'
            }}
          >
            {totalCount} שאלות · פרהיסטוריה, ארכיאולוגיה ותקופת הברונזה בארץ ישראל
          </p>
          <p
            className="text-[10px] text-center mt-1"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            תמונת תל מגידו: Wikimedia Commons
          </p>
        </div>
      </div>
    </div>
  );
}
