'use client';

import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <button
        onClick={onHome}
        className="fixed top-4 left-4 bg-gray-700 dark:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-700 transition"
      >
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto mt-8">
        {!result ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🎴 Flashcard Creator</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Create custom flashcards for any topic to master your learning
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-6">
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What topic do you want to study?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 'Photosynthesis', 'World War II', 'Python Decorators'"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Additional context or notes (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste study notes, textbook excerpts, or add any specific focus areas..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 h-32 resize-none dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleCreateFlashcards}
                disabled={isProcessing || !topic.trim()}
                className="w-full bg-purple-600 dark:bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {isProcessing ? 'Creating Flashcards... Please wait' : 'Create Flashcards'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Why Flashcards?</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                    <span>Active recall improves memory retention</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                    <span>Spaced repetition for long-term learning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                    <span>Portable and easy to review anytime</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                    <span>Progressive difficulty levels</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📚 How It Works</h3>
                <ol className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">1.</strong> Enter a topic or paste study notes
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">2.</strong> AI generates 10-15 flashcards
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">3.</strong> Questions organized by difficulty
                  </li>
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">4.</strong> Review and practice anytime
                  </li>
                </ol>
              </div>
            </div>
          </>
        ) : (
          <FlashcardsView result={result} onReset={() => setResult(null)} />
        )}
      </div>
    </div>
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎴 {result.topic} - Flashcards
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {result.totalCards} flashcards created | {filteredCards.length} in current view
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2 justify-center mb-6 flex-wrap">
        {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              difficulty === level
                ? 'bg-purple-600 dark:bg-purple-700 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {level === 'all' ? '📋 All Cards' : `${level === 'easy' ? '🟢' : level === 'medium' ? '🟡' : '🔴'} ${level.charAt(0).toUpperCase() + level.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Flashcard */}
      <div className="mb-6">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-white rounded-lg shadow-xl cursor-pointer h-64 flex flex-col items-center justify-center p-8 relative overflow-hidden transition-all duration-300"
          style={{
            background: isFlipped
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          }}
        >
          <div className="absolute top-4 right-4 text-white text-sm font-semibold opacity-70">
            {currentCardIndex + 1} / {filteredCards.length}
          </div>

          <div className="text-center text-white">
            <p className="text-sm font-semibold mb-4 opacity-80">
              {isFlipped ? 'ANSWER' : 'QUESTION'}
            </p>
            <p className="text-2xl font-bold leading-relaxed">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
            <p className="text-sm mt-8 opacity-75">Click to flip</p>
          </div>

          <div className="absolute bottom-4 right-4">
            {currentCard.difficulty === 'easy' && (
              <span className="text-2xl">🟢</span>
            )}
            {currentCard.difficulty === 'medium' && (
              <span className="text-2xl">🟡</span>
            )}
            {currentCard.difficulty === 'hard' && (
              <span className="text-2xl">🔴</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="flex-1 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-slate-600 transition disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentCardIndex === filteredCards.length - 1}
          className="flex-1 bg-purple-600 dark:bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* All Cards List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Flashcards</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => {
                setCurrentCardIndex(idx);
                setIsFlipped(false);
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                currentCardIndex === idx
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 dark:border-purple-500'
                  : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-purple-300 dark:hover:border-purple-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{card.question}</p>
                <span className="text-lg ml-2">
                  {card.difficulty === 'easy' && '🟢'}
                  {card.difficulty === 'medium' && '🟡'}
                  {card.difficulty === 'hard' && '🔴'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-purple-600 dark:bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition"
      >
        Create More Flashcards
      </button>
    </div>
  );
}
