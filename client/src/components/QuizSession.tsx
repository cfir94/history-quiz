import { useState, useEffect, useCallback } from "react";
import { type Question } from "@/lib/quizData";
import { X, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

interface QuizSessionProps {
  questions: Question[];
  onFinish: (answers: Record<number, string>) => void;
  onExit: () => void;
}

export default function QuizSession({ questions, onFinish, onExit }: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [animKey, setAnimKey] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = (currentIndex / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswered(false);
    setImageError(false);
    setAnimKey(k => k + 1);
  }, [currentIndex]);

  const handleAnswer = useCallback((answerText: string) => {
    if (answered) return;
    setSelectedAnswer(answerText);
    setAnswered(true);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerText }));
  }, [answered, currentQuestion]);

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onFinish({ ...answers, [currentQuestion.id]: selectedAnswer || '' });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const getAnswerStyle = (answerText: string) => {
    if (!answered) return {};
    const isCorrect = currentQuestion.answers.find(a => a.text === answerText)?.correct;
    const isSelected = answerText === selectedAnswer;
    
    if (isCorrect) {
      return {
        background: 'oklch(0.91 0.08 145)',
        borderColor: 'oklch(0.45 0.15 145)',
        color: 'oklch(0.22 0.1 145)'
      };
    }
    if (isSelected && !isCorrect) {
      return {
        background: 'oklch(0.95 0.06 25)',
        borderColor: 'oklch(0.58 0.2 25)',
        color: 'oklch(0.4 0.15 25)'
      };
    }
    return { opacity: 0.45 };
  };

  const getAnswerClass = (answerText: string) => {
    if (!answered) return 'answer-btn';
    const isCorrect = currentQuestion.answers.find(a => a.text === answerText)?.correct;
    const isSelected = answerText === selectedAnswer;
    if (isCorrect) return 'answer-btn correct animate-correct-pulse';
    if (isSelected && !isCorrect) return 'answer-btn wrong animate-wrong-shake';
    return 'answer-btn';
  };

  const getImageUrl = (question: Question): string | null => {
    if (!question.image) return null;
    if (question.image.type === 'static' && question.image.url) {
      return question.image.url;
    }
    return null;
  };

  const imageUrl = getImageUrl(currentQuestion);
  const imageFit = currentQuestion.image?.fit ?? 'cover';
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const correctAnswer = currentQuestion.answers.find(a => a.correct)?.text;

  // Answer letter labels in Hebrew style
  const answerLabels = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

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
      {/* Top bar */}
      <header 
        className="sticky top-0 z-20 px-4 py-3 border-b"
        style={{ 
          background: 'oklch(0.985 0.012 80 / 0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: 'oklch(0.87 0.03 78)'
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-lg transition-colors hover:bg-accent flex-shrink-0"
            title="יציאה"
          >
            <X className="w-4 h-4" style={{ color: 'oklch(0.52 0.08 65)' }} />
          </button>
          
          <div className="flex-1">
            {/* Progress bar — timeline ruler style */}
            <div
              className="h-2.5 rounded-sm overflow-hidden"
              style={{ background: 'oklch(0.9 0.035 73)', border: '1px solid oklch(0.85 0.035 73)' }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'repeating-linear-gradient(90deg, #6e5230 0px, #6e5230 2px, #8a6a3e 2px, #8a6a3e 10px)'
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span 
                className="text-xs font-semibold tabular-nums"
                style={{ color: 'oklch(0.52 0.08 65)' }}
              >
                {currentIndex + 1} / {totalQuestions}
              </span>
              <span 
                className="text-xs font-black tabular-nums"
                style={{ color: 'oklch(0.33 0.08 50)' }}
              >
                {answeredCount} נענו
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main quiz area */}
      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-2xl">
          
          {/* Category + question number */}
          <div className="mb-4 flex items-center justify-between">
            <span 
              className="text-xs px-3 py-1 rounded-md font-bold tracking-wide"
              style={{ 
                background: 'oklch(0.91 0.03 78)',
                color: 'oklch(0.52 0.08 65)',
                border: '1px solid oklch(0.87 0.03 78)'
              }}
            >
              {currentQuestion.category}
            </span>
            <span 
              className="text-xs font-black tabular-nums"
              style={{ color: 'oklch(0.72 0.1 75)' }}
            >
              שאלה #{currentQuestion.id}
            </span>
          </div>

          {/* Question card — specimen card style */}
          <div
            key={animKey}
            className="animate-slide-in field-card p-6 mb-5"
          >
            {/* Image if present */}
            {imageUrl && !imageError && (
              <div className="mb-5">
                <div
                  className="rounded-lg overflow-hidden border flex items-center justify-center"
                  style={{
                    borderColor: 'oklch(0.87 0.03 78)',
                    background: imageFit === 'contain' ? '#faf6ef' : 'transparent',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="תמונת שאלה"
                    className={imageFit === 'contain' ? 'w-full max-h-72 object-contain p-3' : 'w-full max-h-72 object-cover'}
                    onError={() => setImageError(true)}
                  />
                </div>
                {currentQuestion.image?.credit && (
                  <p className="text-[10px] mt-1 text-left" style={{ color: 'oklch(0.65 0.03 75)' }}>
                    {currentQuestion.image.credit}
                  </p>
                )}
              </div>
            )}
            
            <h2 
              className="text-xl font-bold leading-relaxed"
              style={{ 
                fontFamily: "'Frank Ruhl Libre', serif",
                color: 'oklch(0.2 0.06 60)',
                fontSize: '1.2rem'
              }}
            >
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer options */}
          <div className="space-y-2.5 mb-6">
            {currentQuestion.answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(answer.text)}
                disabled={answered}
                className={`${getAnswerClass(answer.text)} w-full text-right px-4 py-3.5 rounded-lg font-medium text-base transition-all`}
                style={{
                  ...getAnswerStyle(answer.text)
                }}
              >
                <span className="flex items-center gap-3">
                  {/* Hebrew letter label */}
                  <span 
                    className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm font-black"
                    style={{
                      background: answered 
                        ? (answer.correct ? 'oklch(0.45 0.15 145)' : (answer.text === selectedAnswer ? 'oklch(0.58 0.2 25)' : 'oklch(0.87 0.03 78)'))
                        : 'oklch(0.91 0.03 78)',
                      color: answered
                        ? (answer.correct || answer.text === selectedAnswer ? 'white' : 'oklch(0.55 0.04 70)')
                        : 'oklch(0.52 0.08 65)',
                      fontFamily: "'Frank Ruhl Libre', serif"
                    }}
                  >
                    {answerLabels[idx] || String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-right">{answer.text}</span>
                  {answered && answer.correct && (
                    <CheckCircle2 className="flex-shrink-0 w-5 h-5" style={{ color: 'oklch(0.45 0.15 145)' }} />
                  )}
                  {answered && answer.text === selectedAnswer && !answer.correct && (
                    <XCircle className="flex-shrink-0 w-5 h-5" style={{ color: 'oklch(0.58 0.2 25)' }} />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Feedback after answering */}
          {answered && (
            <div 
              className="rounded-lg p-4 mb-5 border animate-slide-in"
              style={{
                background: selectedAnswer === correctAnswer 
                  ? 'oklch(0.91 0.08 145)' 
                  : 'oklch(0.95 0.06 25)',
                borderColor: selectedAnswer === correctAnswer 
                  ? 'oklch(0.45 0.15 145)' 
                  : 'oklch(0.58 0.2 25)'
              }}
            >
              <div className="flex items-center gap-2 font-black text-base mb-1" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>
                {selectedAnswer === correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" style={{ color: 'oklch(0.38 0.12 145)' }} />
                    <span style={{ color: 'oklch(0.22 0.1 145)' }}>נכון! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" style={{ color: 'oklch(0.55 0.2 25)' }} />
                    <span style={{ color: 'oklch(0.4 0.15 25)' }}>לא נכון</span>
                  </>
                )}
              </div>
              {selectedAnswer !== correctAnswer && (
                <p className="text-sm font-semibold" style={{ color: 'oklch(0.35 0.1 25)' }}>
                  התשובה הנכונה: <strong>{correctAnswer}</strong>
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border font-semibold text-sm transition-all disabled:opacity-30 hover:bg-accent"
              style={{
                background: 'oklch(0.985 0.012 80)',
                borderColor: 'oklch(0.87 0.03 78)',
                color: 'oklch(0.45 0.07 65)'
              }}
            >
              <ChevronRight className="w-4 h-4" />
              קודם
            </button>

            {answered && (
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base text-white transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.28 0.09 50), oklch(0.38 0.1 50))',
                  boxShadow: '0 4px 16px oklch(0.28 0.09 50 / 0.3)',
                  fontFamily: "'Frank Ruhl Libre', serif",
                  fontSize: '1.05rem'
                }}
              >
                {isLastQuestion ? 'סיים בוחן ✓' : 'שאלה הבאה ←'}
              </button>
            )}

            {!answered && (
              <div 
                className="flex-1 text-center text-sm font-medium py-3"
                style={{ color: 'oklch(0.65 0.05 70)' }}
              >
                בחר תשובה להמשיך
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
