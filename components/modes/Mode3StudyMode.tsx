'use client';

import { useState, useEffect } from 'react';

interface Mode3Props {
  onHome: () => void;
}

interface StudyPoint {
  teachingPoint: string;
  question: string;
}

export default function Mode3StudyMode({ onHome }: Mode3Props) {
  const [topic, setTopic] = useState('');
  const [material, setMaterial] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyStarted, setStudyStarted] = useState(false);

  const handleStartStudy = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/teaching-assistant/study-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, material }),
      });

      if (!response.ok) {
        let errMsg = 'Failed to start study session';
        try {
          const errorData = await response.json();
          errMsg = errorData.error || errMsg;
        } catch {
          errMsg = await response.text();
        }
        throw new Error(errMsg);
      }

      setStudyStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <button
        onClick={onHome}
        className="fixed top-4 left-4 bg-gray-700 dark:bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-700 transition"
      >
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto mt-8">
        {!studyStarted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🧠 Study Mode</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                50% Teaching + 50% Questioning for deep learning
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-6">
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What topic would you like to study?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 'Photosynthesis', 'Algebra Basics', 'French Grammar'"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Study Material (optional - paste your notes or textbook content)
                </label>
                <textarea
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Paste your study notes, lecture slides, or textbook excerpts here. This helps the AI teach from your specific material."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 h-40 resize-none dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleStartStudy}
                disabled={isProcessing || !topic.trim()}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {isProcessing ? 'Starting Study Session...' : 'Start Study Session'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎓 Socratic Method Approach
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span>Teacher explains concepts (50%)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span>You answer guided questions (50%)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span>Progressive difficulty levels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    <span>Learn through active thinking</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Study Session Structure
                </h3>
                <ol className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
                  <li>
                    <strong className="text-green-600 dark:text-green-400">1. Teaching</strong> - Learn a concept
                  </li>
                  <li>
                    <strong className="text-green-600 dark:text-green-400">2. Question</strong> - Apply your
                    knowledge
                  </li>
                  <li>
                    <strong className="text-green-600 dark:text-green-400">3. Feedback</strong> - Get corrections
                  </li>
                  <li>
                    <strong className="text-green-600 dark:text-green-400">4. Repeat</strong> - Continue with
                    new topics
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💡 Pro Tips</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                <li>
                  • <strong>Without material:</strong> AI will teach from general knowledge of
                  the topic
                </li>
                <li>
                  • <strong>With material:</strong> AI will teach specifically from your notes
                  or textbook
                </li>
                <li>
                  • <strong>Best results:</strong> Paste your actual class notes for most
                  relevant teaching
                </li>
                <li>
                  • <strong>Interactive:</strong> Your answers shape how the AI continues teaching
                </li>
              </ul>
            </div>
          </>
        ) : (
          <StudySessionView
            topic={topic}
            material={material}
            onEnd={() => {
              setStudyStarted(false);
              setTopic('');
              setMaterial('');
            }}
          />
        )}
      </div>
    </div>
  );
}

function StudySessionView({
  topic,
  material,
  onEnd,
}: {
  topic: string;
  material: string;
  onEnd: () => void;
}) {
  const [studyPoints, setStudyPoints] = useState<StudyPoint[]>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load initial study points
  useEffect(() => {
    const loadStudyPoints = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/teaching-assistant/study-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, material, pointCount: 5 }),
        });

        if (!response.ok) {
          throw new Error('Failed to load study points');
        }

        const data = await response.json();
        setStudyPoints(data.points || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    loadStudyPoints();
  }, [topic, material]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError('Please provide an answer');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/teaching-assistant/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: studyPoints[currentPointIndex].question,
          userAnswer,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setIsAnswered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate answer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentPointIndex < studyPoints.length - 1) {
      setCurrentPointIndex(currentPointIndex + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setFeedback('');
    } else {
      // Option to load more or end session
      handleEnd();
    }
  };

  const handleEnd = () => {
    onEnd();
  };

  if (isLoading && studyPoints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-xl text-gray-700 dark:text-gray-300">Preparing your study session...</p>
      </div>
    );
  }

  if (studyPoints.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-700 dark:text-red-400">{error || 'Failed to load study content'}</p>
        <button
          onClick={handleEnd}
          className="mt-4 bg-gray-600 dark:bg-gray-700 text-white px-6 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentPoint = studyPoints[currentPointIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🧠 Study Session: {topic}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Question {currentPointIndex + 1} of {studyPoints.length}
        </p>
        <div className="mt-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
            style={{
              width: `${((currentPointIndex + 1) / studyPoints.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Teaching Point */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg shadow-lg p-8 mb-6 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📚</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase mb-2">
              Teaching Point
            </h3>
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
              {currentPoint.teachingPoint}
            </p>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-6 border-2 border-green-500 dark:border-green-700">
        <div className="flex items-start gap-4">
          <span className="text-4xl">❓</span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase mb-2">
              Your Turn
            </h3>
            <p className="text-lg text-gray-900 dark:text-white font-semibold mb-6">
              {currentPoint.question}
            </p>

            {!isAnswered ? (
              <>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 h-32 resize-none mb-4 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                {error && (
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                )}
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isLoading || !userAnswer.trim()}
                  className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
                >
                  {isLoading ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Your Answer:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{userAnswer}</p>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-lg">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2">📝 Feedback:</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{feedback}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition"
                >
                  {currentPointIndex < studyPoints.length - 1
                    ? 'Next Question →'
                    : 'Complete Study Session'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress and End Button */}
      <div className="flex gap-4">
        <button
          onClick={handleEnd}
          className="flex-1 bg-gray-500 dark:bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 dark:hover:bg-gray-600 transition"
        >
          End Session Early
        </button>
      </div>

      {/* Study Tips */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💡 Study Tips</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>• Think carefully before answering - there's no time limit</li>
          <li>• Try to explain your reasoning, not just the answer</li>
          <li>• Feedback will help you understand the concept better</li>
          <li>• Feel free to ask follow-up questions through your answers</li>
        </ul>
      </div>
    </div>
  );
}
