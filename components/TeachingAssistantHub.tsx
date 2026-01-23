'use client';

import { useState } from 'react';
import Mode1NotesProcessor from './modes/Mode1NotesProcessor';
import Mode2FlashcardCreator from './modes/Mode2FlashcardCreator';
import Mode3StudyMode from './modes/Mode3StudyMode';
import Mode4ExamPrep from './modes/Mode4ExamPrep';

type ModeType = 'home' | 'mode1' | 'mode2' | 'mode3' | 'mode4';

export default function TeachingAssistantHub() {
  const [currentMode, setCurrentMode] = useState<ModeType>('home');

  const goHome = () => setCurrentMode('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Theme Toggle Button - Coming Soon */}
      <button
        disabled
        className="fixed top-4 right-4 bg-slate-800 text-yellow-300 px-4 py-2 rounded-lg opacity-50 cursor-not-allowed flex items-center gap-2"
        title="Dark mode theme - Coming soon: Light mode toggle"
      >
        🌙 Dark Mode
        <span className="text-xs bg-yellow-400 text-slate-900 px-2 py-1 rounded font-semibold">Coming Soon</span>
      </button>

      {currentMode === 'home' && <ModeSelector setMode={setCurrentMode} />}
      {currentMode === 'mode1' && <Mode1NotesProcessor onHome={goHome} />}
      {currentMode === 'mode2' && <Mode2FlashcardCreator onHome={goHome} />}
      {currentMode === 'mode3' && <Mode3StudyMode onHome={goHome} />}
      {currentMode === 'mode4' && <Mode4ExamPrep onHome={goHome} />}
    </div>
  );
}

interface ModeSelectorProps {
  setMode: (mode: ModeType) => void;
}

function ModeSelector({ setMode }: ModeSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📚 Teaching Assistant Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your AI-powered learning companion - Choose a mode to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Mode 1: Notes Processor */}
          <div
            onClick={() => setMode('mode1')}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 p-8 cursor-pointer hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-slate-800 transition-shadow hover:scale-105 transform"
          >
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Notes Processor
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Convert handwritten notes into clean, organized, and summarized typed content
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>✓ Digitize handwritten notes</p>
              <p>✓ Automatic organization</p>
              <p>✓ Key concepts extraction</p>
              <p>✓ Generate summaries</p>
            </div>
            <button className="mt-6 w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition">
              Get Started →
            </button>
          </div>

          {/* Mode 2: Flashcard Creator */}
          <div
            onClick={() => setMode('mode2')}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 p-8 cursor-pointer hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-slate-800 transition-shadow hover:scale-105 transform"
          >
            <div className="text-5xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Flashcard Creator
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate interactive flashcards from any topic for effective memorization
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>✓ Create custom flashcards</p>
              <p>✓ Progressive difficulty levels</p>
              <p>✓ Optimized for learning</p>
              <p>✓ Easy review & practice</p>
            </div>
            <button className="mt-6 w-full bg-purple-600 dark:bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition">
              Get Started →
            </button>
          </div>

          {/* Mode 3: Study Mode */}
          <div
            onClick={() => setMode('mode3')}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 p-8 cursor-pointer hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-slate-800 transition-shadow hover:scale-105 transform"
          >
            <div className="text-5xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Study Mode
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Interactive learning with 50% teaching and 50% questioning approach
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>✓ Balanced teaching & questioning</p>
              <p>✓ Socratic method education</p>
              <p>✓ Adaptive difficulty</p>
              <p>✓ Reinforce learning</p>
            </div>
            <button className="mt-6 w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition">
              Get Started →
            </button>
          </div>

          {/* Mode 4: Exam Prep Analyzer */}
          <div
            onClick={() => setMode('mode4')}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 p-8 cursor-pointer hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-slate-800 transition-shadow hover:scale-105 transform"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Exam Prep Analyzer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Analyze syllabus and past year questions to get smart study priorities
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>✓ Identify high-priority topics</p>
              <p>✓ Cross-reference with PYQs</p>
              <p>✓ Smart time allocation</p>
              <p>✓ Last-minute revision guide</p>
            </div>
            <button className="mt-6 w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition">
              Get Started →
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How to use the Teaching Assistant Hub
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <p className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Mode 1 - Notes Processor</p>
              <p>Upload your handwritten notes or PDF. The AI will digitize, organize, and create summaries for quick review.</p>
            </div>
            <div>
              <p className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Mode 2 - Flashcards</p>
              <p>Enter a topic or paste study material. The AI generates flashcards with questions and answers at varying difficulty levels.</p>
            </div>
            <div>
              <p className="font-semibold text-green-600 dark:text-green-400 mb-2">Mode 3 - Study Mode</p>
              <p>Learn actively with AI that teaches concepts and asks questions. Perfect for deep understanding and knowledge retention.</p>
            </div>
            <div>
              <p className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Mode 4 - Exam Prep</p>
              <p>Upload syllabus and past year questions. Get intelligent prioritization of topics for maximum exam success.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
