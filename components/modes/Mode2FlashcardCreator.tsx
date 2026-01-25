'use client';

import { useState } from 'react';
import { Layers, Sparkles, Target, BookOpen, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import TopicGraphVisualizer from '@/components/TopicGraphVisualizer';
import ConceptMapDiagram from '@/components/ConceptMapDiagram';
import {
  ModeWrapper,
  ModeCard,
  ModeSectionTitle,
  ModeButton,
  ModeInput,
  ModeLoading,
  ModeError,
} from './ModeWrapper';

interface Mode2Props {
  onHome: () => void;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardsResult {
  topic: string;
  flashcards: Flashcard[];
  totalCards: number;
}

export default function Mode2FlashcardCreator({ onHome }: Mode2Props) {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FlashcardsResult | null>(null);

  const handleCreateFlashcards = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/teaching-assistant/create-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, description }),
      });

      if (!response.ok) {
        let errMsg = 'Failed to create flashcards';
        try {
          const errorData = await response.json();
          errMsg = errorData.error || errMsg;
        } catch {
          errMsg = await response.text();
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModeWrapper
      title="Flashcard Creator"
      description="Create custom flashcards for any topic to master your learning"
      icon={<Layers className="h-6 w-6" />}
      onBack={onHome}
      headerColor="from-purple-500 to-purple-600"
    >
      {isProcessing ? (
        <ModeLoading text="Creating your flashcards with AI..." />
      ) : !result ? (
        <div className="space-y-6">
          <ModeCard>
            <ModeInput
              label="What topic do you want to study?"
              placeholder="e.g., 'Photosynthesis', 'World War II', 'Python Decorators'"
              value={topic}
              onChange={setTopic}
            />

            <div className="mt-4">
              <ModeInput
                label="Additional context or notes (optional)"
                placeholder="Paste study notes, textbook excerpts, or add any specific focus areas..."
                value={description}
                onChange={setDescription}
                type="textarea"
                rows={4}
              />
            </div>

            {error && <ModeError message={error} className="mt-4" />}

            <ModeButton
              onClick={handleCreateFlashcards}
              disabled={!topic.trim()}
              className="mt-6"
            >
              <Sparkles className="mr-2 inline h-4 w-4" />
              Create Flashcards
            </ModeButton>
          </ModeCard>

          <div className="grid gap-6 md:grid-cols-2">
            <ModeCard>
              <ModeSectionTitle
                icon={<Target className="h-5 w-5 text-purple-500" />}
                title="Why Flashcards?"
              />
              <ul className="space-y-3 text-sm">
                {[
                  'Active recall improves memory retention',
                  'Spaced repetition for long-term learning',
                  'Portable and easy to review anytime',
                  'Progressive difficulty levels',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ModeCard>

            <ModeCard>
              <ModeSectionTitle
                icon={<BookOpen className="h-5 w-5 text-purple-500" />}
                title="How It Works"
              />
              <ol className="space-y-3 text-sm">
                {[
                  'Enter a topic or paste study notes',
                  'AI generates 10-15 flashcards',
                  'Questions organized by difficulty',
                  'Review and practice anytime',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ol>
            </ModeCard>
          </div>
        </div>
      ) : (
        <FlashcardsView result={result} onReset={() => setResult(null)} />
      )}
    </ModeWrapper>
  );
}

function FlashcardsView({
  result,
  onReset,
}: {
  result: FlashcardsResult;
  onReset: () => void;
}) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredCards =
    difficulty === 'all'
      ? result.flashcards
      : result.flashcards.filter((card) => card.difficulty === difficulty);

  const currentCard = filteredCards[currentCardIndex];

  const handleNext = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{result.topic} - Flashcards</h2>
        <p className="mt-1 text-muted-foreground">
          {result.totalCards} flashcards created | {filteredCards.length} in current view
        </p>
      </div>

      {/* Topic Graph Visualizer */}
      <TopicGraphVisualizer topic={result.topic} flashcards={result.flashcards} />

      {/* Concept Map Diagram */}
      <ConceptMapDiagram topic={result.topic} flashcards={result.flashcards} />

      {/* Difficulty Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${difficulty === level
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            {level !== 'all' && (
              <span className={`h-2 w-2 rounded-full ${difficultyColors[level]}`} />
            )}
            {level === 'all' ? 'All Cards' : level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Flashcard */}
      {currentCard && (
        <ModeCard className="p-0 overflow-hidden">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative h-64 cursor-pointer p-8 transition-all duration-300 ${isFlipped
                ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                : 'bg-gradient-to-br from-pink-500 to-rose-500'
              }`}
          >
            <div className="absolute right-4 top-4 text-sm font-semibold text-white/70">
              {currentCardIndex + 1} / {filteredCards.length}
            </div>

            <div className="flex h-full flex-col items-center justify-center text-center text-white">
              <p className="mb-4 text-sm font-semibold opacity-80">
                {isFlipped ? 'ANSWER' : 'QUESTION'}
              </p>
              <p className="text-xl font-bold leading-relaxed md:text-2xl">
                {isFlipped ? currentCard.answer : currentCard.question}
              </p>
              <p className="mt-6 text-sm opacity-75">Click to flip</p>
            </div>

            <div className="absolute bottom-4 right-4">
              <span className={`inline-block h-4 w-4 rounded-full ${difficultyColors[currentCard.difficulty]}`} />
            </div>
          </div>
        </ModeCard>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted py-3 font-medium transition-all hover:bg-muted/80 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentCardIndex === filteredCards.length - 1}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* All Cards List */}
      <ModeCard>
        <ModeSectionTitle title="All Flashcards" />
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {filteredCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => {
                setCurrentCardIndex(idx);
                setIsFlipped(false);
              }}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${currentCardIndex === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted/50 hover:border-primary/30'
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{card.question}</p>
                <span className={`h-3 w-3 shrink-0 rounded-full ${difficultyColors[card.difficulty]}`} />
              </div>
            </div>
          ))}
        </div>
      </ModeCard>

      <ModeButton onClick={onReset} variant="outline">
        <RotateCcw className="mr-2 inline h-4 w-4" />
        Create More Flashcards
      </ModeButton>
    </div>
  );
}
