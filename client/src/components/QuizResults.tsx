import { useState } from "react";
import { type Question, type Category } from "@/lib/quizData";
import { RotateCcw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";

interface QuizResultsProps {
  questions: Question[];
  answers: Record<number, string>;
  onRestart: () => void;
  onRetry: () => void;
  category: Category;
}

export default function QuizResults({ questions, answers, onRestart, onRetry, category }: QuizResultsProps) {
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const correctCount = questions.filter(q => {
    const userAnswer = answers[q.id];
    const correct = q.answers.find(a => a.correct)?.text;
    return userAnswer === correct;
  }).length;

  const totalCount = questions.length;
  const score = Math.round((correctCount / totalCount) * 100);
  const wrongCount = totalCount - correctCount;

  const getScoreEmoji = () => {
    if (score >= 90) return '🏆';
    if (score >= 75) return '🌟';
    if (score >= 60) return '🏺';
    if (score >= 40) return '📚';
    return '💪';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'מצוין! אתה מוכן לבחינה!';
    if (score >= 75) return 'כל הכבוד! תוצאה טובה מאוד';
    if (score >= 60) return 'לא רע! כדאי לחזור על החומר';
    if (score >= 40) return 'יש מה לשפר — המשך לתרגל';
    return 'צריך לחזור על החומר — אל תתייאש!';
  };

  const getScoreColor = () => {
    if (score >= 75) return 'oklch(0.32 0.11 145)';
    if (score >= 50) return 'oklch(0.72 0.1 75)';
    return 'oklch(0.58 0.2 25)';
  };

  const getScoreGradientStops = (): [string, string] => {
    if (score >= 75) return ['oklch(0.4 0.13 145)', 'oklch(0.6 0.12 135)'];
    if (score >= 50) return ['oklch(0.6 0.12 65)', 'oklch(0.78 0.11 80)'];
    return ['oklch(0.5 0.2 25)', 'oklch(0.68 0.18 35)'];
  };

  const filteredQuestions = questions.filter(q => {
    const userAnswer = answers[q.id];
    const correct = q.answers.find(a => a.correct)?.text;
    if (reviewFilter === 'correct') return userAnswer === correct;
    if (reviewFilter === 'wrong') return userAnswer !== correct;
    return true;
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{
        fontFamily: "'Heebo', sans-serif",
        backgroundImage: `linear-gradient(oklch(0.3 0.03 60 / 0.7), oklch(0.3 0.03 60 / 0.7)), url(${import.meta.env.BASE_URL}images/hero/archive-bg.jpg)`,
        backgroundSize: 'auto, 500px',
        backgroundRepeat: 'repeat, repeat',
        backgroundAttachment: 'fixed, fixed',
      }}
    >
      {/* Ambient warm glow accents */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, oklch(0.78 0.07 50 / 0.18) 0%, transparent 45%),
            radial-gradient(ellipse at 80% 80%, oklch(0.72 0.1 75 / 0.15) 0%, transparent 45%)
          `
        }}
      />

      <main className="flex-1 flex flex-col items-center px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl">
          
          {/* Score card — specimen report style */}
          <div className="field-card p-8 mb-6 text-center">
            {/* Score emoji */}
            <div className="text-5xl mb-4">{getScoreEmoji()}</div>
            
            {/* Score circle */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="scoreRingGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={getScoreGradientStops()[0]} />
                    <stop offset="1" stopColor={getScoreGradientStops()[1]} />
                  </linearGradient>
                </defs>
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="oklch(0.91 0.03 78)"
                  strokeWidth="10"
                />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="url(#scoreRingGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span 
                  className="text-4xl font-black tabular-nums"
                  style={{ 
                    color: getScoreColor(),
                    fontFamily: "'Frank Ruhl Libre', serif"
                  }}
                >
                  {score}%
                </span>
              </div>
            </div>

            <h2 
              className="text-2xl font-black mb-2"
              style={{ fontFamily: "'Frank Ruhl Libre', serif", color: 'oklch(0.24 0.06 50)' }}
            >
              {getScoreMessage()}
            </h2>
            
            <p className="mb-6" style={{ color: 'oklch(0.52 0.08 65)', fontSize: '0.9rem' }}>
              {category !== 'הכל' && <span className="font-bold">נושא: {category} · </span>}
              ענית נכון על <strong>{correctCount}</strong> מתוך <strong>{totalCount}</strong> שאלות
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div 
                className="rounded-lg p-3 border"
                style={{ background: 'oklch(0.91 0.08 145)', borderColor: 'oklch(0.75 0.12 145)' }}
              >
                <div 
                  className="text-2xl font-black tabular-nums"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: 'oklch(0.28 0.12 145)' }}
                >
                  {correctCount}
                </div>
                <div className="text-xs font-bold" style={{ color: 'oklch(0.38 0.1 145)' }}>נכון ✓</div>
              </div>
              <div 
                className="rounded-lg p-3 border"
                style={{ background: 'oklch(0.95 0.06 25)', borderColor: 'oklch(0.75 0.15 25)' }}
              >
                <div 
                  className="text-2xl font-black tabular-nums"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: 'oklch(0.5 0.18 25)' }}
                >
                  {wrongCount}
                </div>
                <div className="text-xs font-bold" style={{ color: 'oklch(0.55 0.15 25)' }}>שגוי ✗</div>
              </div>
              <div 
                className="rounded-lg p-3 border"
                style={{ background: 'oklch(0.93 0.022 78)', borderColor: 'oklch(0.87 0.03 78)' }}
              >
                <div 
                  className="text-2xl font-black tabular-nums"
                  style={{ fontFamily: "'Frank Ruhl Libre', serif", color: 'oklch(0.45 0.07 65)' }}
                >
                  {totalCount}
                </div>
                <div className="text-xs font-bold" style={{ color: 'oklch(0.55 0.05 70)' }}>סה"כ</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-white transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.28 0.09 50), oklch(0.38 0.1 50))',
                  boxShadow: '0 4px 16px oklch(0.28 0.09 50 / 0.3)',
                  fontFamily: "'Frank Ruhl Libre', serif",
                  fontSize: '1rem'
                }}
              >
                <RotateCcw className="w-4 h-4" />
                נסה שוב
              </button>
              <button
                onClick={onRestart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold border transition-all active:scale-[0.98] hover:bg-accent"
                style={{
                  background: 'oklch(0.97 0.018 82)',
                  borderColor: 'oklch(0.87 0.03 78)',
                  color: 'oklch(0.38 0.07 65)'
                }}
              >
                <Home className="w-4 h-4" />
                דף הבית
              </button>
            </div>
          </div>

          {/* Review section */}
          <div
            className="border overflow-hidden"
            style={{
              background: 'oklch(0.975 0.018 76)',
              borderColor: 'oklch(0.85 0.035 73)',
              borderRadius: '0.6rem',
            }}
          >
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between px-6 py-4 font-black transition-colors hover:bg-accent"
              style={{
                color: 'oklch(0.24 0.06 50)',
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: '1rem'
              }}
            >
              <span>סקירת שאלות</span>
              {showReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showReview && (
              <div>
                {/* Filter tabs */}
                <div 
                  className="flex border-t border-b px-4 py-2 gap-2"
                  style={{ borderColor: 'oklch(0.87 0.03 78)' }}
                >
                  {(['all', 'correct', 'wrong'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setReviewFilter(filter)}
                      className="px-3 py-1.5 rounded-md text-sm font-bold transition-all"
                      style={{
                        background: reviewFilter === filter ? 'oklch(0.33 0.08 50)' : 'transparent',
                        color: reviewFilter === filter ? 'white' : 'oklch(0.52 0.08 65)'
                      }}
                    >
                      {filter === 'all' ? `הכל (${totalCount})` : filter === 'correct' ? `נכון (${correctCount})` : `שגוי (${wrongCount})`}
                    </button>
                  ))}
                </div>

                {/* Questions list */}
                <div className="divide-y" style={{ borderColor: 'oklch(0.93 0.01 80)' }}>
                  {filteredQuestions.map((q) => {
                    const userAnswer = answers[q.id];
                    const correctAns = q.answers.find(a => a.correct)?.text;
                    const isCorrect = userAnswer === correctAns;

                    return (
                      <div key={q.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isCorrect 
                              ? <CheckCircle2 className="w-5 h-5" style={{ color: 'oklch(0.45 0.15 145)' }} />
                              : <XCircle className="w-5 h-5" style={{ color: 'oklch(0.58 0.2 25)' }} />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p 
                              className="text-sm font-bold mb-1"
                              style={{ 
                                color: 'oklch(0.25 0.05 60)',
                                fontFamily: "'Frank Ruhl Libre', serif"
                              }}
                            >
                              {q.question}
                            </p>
                            {!isCorrect && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium" style={{ color: 'oklch(0.55 0.15 25)' }}>
                                  ✗ ענית: {userAnswer || 'לא ענית'}
                                </p>
                                <p className="text-xs font-bold" style={{ color: 'oklch(0.32 0.11 145)' }}>
                                  ✓ תשובה נכונה: {correctAns}
                                </p>
                              </div>
                            )}
                            {isCorrect && (
                              <p className="text-xs font-medium" style={{ color: 'oklch(0.45 0.12 145)' }}>
                                ✓ {correctAns}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
