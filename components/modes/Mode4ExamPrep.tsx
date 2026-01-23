'use client';

import { useState } from 'react';

interface Mode4Props {
  onHome: () => void;
}

interface ExamPrepResult {
  analysis: {
    highPriority: Array<{
      topic: string;
      frequency: number;
      estimatedMarks: number;
      reason: string;
      keyPoints: string[];
    }>;
    mediumPriority: Array<{
      topic: string;
      frequency: number;
      estimatedMarks: number;
      reason: string;
      keyPoints: string[];
    }>;
    lowPriority: Array<{
      topic: string;
      frequency: number;
      estimatedMarks: number;
      reason: string;
      keyPoints: string[];
    }>;
    timeAllocation: string;
    lastMinuteChecklist: string[];
    examStrategy: string;
  };
}

export default function Mode4ExamPrep({ onHome }: Mode4Props) {
  const [syllabus, setSyllabus] = useState('');
  const [pyqs, setPyqs] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamPrepResult | null>(null);

  const handleAnalyze = async () => {
    if (!syllabus.trim() && !pyqs.trim()) {
      setError('Please provide either a syllabus or past year questions');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/teaching-assistant/exam-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus, pyqs }),
      });

      if (!response.ok) {
        let errMsg = 'Failed to analyze content';
        try {
          const errorData = await response.json();
          errMsg = errorData.error || errMsg;
        } catch {
          errMsg = await response.text();
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <button
        onClick={onHome}
        className="fixed top-4 left-4 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
      >
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto mt-8">
        {!result ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">🎯 Exam Prep Analyzer</h1>
              <p className="text-lg text-gray-300">
                Upload your syllabus and past year questions to get personalized study priorities
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-8 mb-6">
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-3">
                  📚 Syllabus (paste text, PDF content, or describe topics)
                </label>
                <textarea
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Paste your course syllabus or list all topics covered in your course..."
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-700 text-white placeholder-slate-400 h-40 resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-3">
                  📋 Past Year Questions (paste previous exam papers or PYQs)
                </label>
                <textarea
                  value={pyqs}
                  onChange={(e) => setPyqs(e.target.value)}
                  placeholder="Paste past year exam questions, papers, or sample questions that might appear in your exam..."
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-slate-700 text-white placeholder-slate-400 h-40 resize-none"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-950 border border-red-900 rounded-lg">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isProcessing || (!syllabus.trim() && !pyqs.trim())}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                {isProcessing ? 'Analyzing Content... Please wait' : 'Analyze & Get Study Plan'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎯 How It Works</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span>Analyzes syllabus to identify all topics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span>Cross-references with past year questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span>Identifies frequently asked topics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span>Prioritizes by marks and frequency</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📊 You'll Receive</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>High priority topics (must study)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    <span>Medium priority topics (should study)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2">✓</span>
                    <span>Low priority topics (nice to know)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Last-minute revision checklist</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-blue-950 border border-blue-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">💡 Pro Tips</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>
                  • <strong>For best results:</strong> Provide complete syllabus and multiple years of PYQs
                </li>
                <li>
                  • <strong>Topics that appear 3+ times in PYQs</strong> are usually high priority
                </li>
                <li>
                  • <strong>Last-minute revision:</strong> Use the generated checklist 2-3 days before exam
                </li>
                <li>
                  • <strong>Time allocation:</strong> Follow the recommended study hours for each priority level
                </li>
              </ul>
            </div>
          </>
        ) : (
          <ExamPrepResults result={result} onReset={() => setResult(null)} />
        )}
      </div>
    </div>
  );
}

function ExamPrepResults({ result, onReset }: { result: ExamPrepResult; onReset: () => void }) {
  const [activeTab, setActiveTab] = useState<'high' | 'medium' | 'low' | 'strategy'>('high');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🎯 Your Exam Prep Strategy</h2>
        <p className="text-gray-300">Personalized study priorities based on your syllabus and past questions</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-6 bg-slate-800 rounded-lg shadow p-2 flex-wrap justify-center">
        {[
          { id: 'high', label: '🔴 High Priority', color: 'bg-red-600' },
          { id: 'medium', label: '🟡 Medium Priority', color: 'bg-yellow-600' },
          { id: 'low', label: '🟢 Low Priority', color: 'bg-green-600' },
          { id: 'strategy', label: '📊 Exam Strategy', color: 'bg-purple-600' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === tab.id ? `${tab.color} text-white` : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'high' && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-red-400 mb-6">🔴 High Priority Topics</h3>
            <p className="text-gray-300 mb-6 text-sm">These topics appear frequently in past papers and carry significant marks. Study these first!</p>
            <div className="space-y-4">
              {result.analysis.highPriority.map((item, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-6 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-white">{item.topic}</h4>
                    <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {item.frequency}x in PYQs
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{item.reason}</p>
                  <div className="flex gap-3 text-sm">
                    <span className="bg-slate-600 px-3 py-1 rounded text-gray-200">Est. Marks: {item.estimatedMarks}</span>
                  </div>
                  {item.keyPoints.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <p className="text-gray-400 text-sm font-semibold mb-2">Key Points:</p>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                        {item.keyPoints.slice(0, 3).map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'medium' && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">🟡 Medium Priority Topics</h3>
            <p className="text-gray-300 mb-6 text-sm">These topics appear occasionally in exams. Study after completing high priority topics.</p>
            <div className="space-y-4">
              {result.analysis.mediumPriority.map((item, idx) => (
                <div key={idx} className="bg-slate-700 rounded-lg p-6 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-white">{item.topic}</h4>
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {item.frequency}x in PYQs
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{item.reason}</p>
                  <div className="flex gap-3 text-sm">
                    <span className="bg-slate-600 px-3 py-1 rounded text-gray-200">Est. Marks: {item.estimatedMarks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'low' && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-6">🟢 Low Priority Topics</h3>
            <p className="text-gray-300 mb-6 text-sm">These topics are in syllabus but rarely appear in exams. Study if you have extra time.</p>
            <div className="space-y-4">
              {result.analysis.lowPriority.length > 0 ? (
                result.analysis.lowPriority.map((item, idx) => (
                  <div key={idx} className="bg-slate-700 rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-white">{item.topic}</h4>
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                        {item.frequency}x in PYQs
                      </span>
                    </div>
                    <p className="text-gray-300">{item.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">All syllabus topics appear to be important!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">⏱️ Recommended Time Allocation</h3>
              <p className="text-white text-lg font-semibold whitespace-pre-wrap">{result.analysis.timeAllocation}</p>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">📋 Last-Minute Revision Checklist</h3>
              <ul className="space-y-3">
                {result.analysis.lastMinuteChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <input
                      type="checkbox"
                      className="mt-1 mr-3 w-5 h-5 rounded border-gray-500 cursor-pointer"
                      id={`item-${idx}`}
                    />
                    <label htmlFor={`item-${idx}`} className="cursor-pointer flex-1">
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">🎯 Exam Strategy</h3>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{result.analysis.examStrategy}</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Analyze Another Exam
      </button>
    </div>
  );
}
