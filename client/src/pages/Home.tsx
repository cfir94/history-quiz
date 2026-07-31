import { useState } from "react";
import QuizLanding from "@/components/QuizLanding";
import QuizSession from "@/components/QuizSession";
import QuizResults from "@/components/QuizResults";
import { QUESTIONS, CATEGORIES, type Category, type Question } from "@/lib/quizData";

type AppState = 'landing' | 'quiz' | 'results';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedCategory, setSelectedCategory] = useState<Category>('הכל');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const startQuiz = (category: Category, shuffle: boolean) => {
    setSelectedCategory(category);
    setShuffleMode(shuffle);
    
    let filtered = category === 'הכל' 
      ? [...QUESTIONS] 
      : QUESTIONS.filter(q => q.category === category);
    
    if (shuffle) {
      filtered = shuffleArray(filtered);
      // Also shuffle answers within each question
      filtered = filtered.map(q => ({
        ...q,
        answers: shuffleArray(q.answers)
      }));
    }
    
    setQuizQuestions(filtered);
    setAnswers({});
    setAppState('quiz');
  };

  const finishQuiz = (finalAnswers: Record<number, string>) => {
    setAnswers(finalAnswers);
    setAppState('results');
  };

  const restartQuiz = () => {
    setAppState('landing');
    setAnswers({});
    setQuizQuestions([]);
  };

  const retryQuiz = () => {
    startQuiz(selectedCategory, shuffleMode);
  };

  if (appState === 'landing') {
    return <QuizLanding onStart={startQuiz} />;
  }

  if (appState === 'quiz') {
    return (
      <QuizSession
        questions={quizQuestions}
        onFinish={finishQuiz}
        onExit={restartQuiz}
      />
    );
  }

  if (appState === 'results') {
    return (
      <QuizResults
        questions={quizQuestions}
        answers={answers}
        onRestart={restartQuiz}
        onRetry={retryQuiz}
        category={selectedCategory}
      />
    );
  }

  return null;
}
