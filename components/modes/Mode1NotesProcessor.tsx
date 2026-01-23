'use client';

import { useState } from 'react';

interface Mode1Props {
  onHome: () => void;
}

interface ProcessedResult {
  typedNotes: string;
  summary: string;
  keyConcepts: string[];
  takeaways: string[];
  questionsToStudy: string[];
}

export default function Mode1NotesProcessor({ onHome }: Mode1Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
        setResult(null);
      } else {
        setError('Please upload a PDF or image file (JPG, PNG)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
        setResult(null);
      } else {
        setError('Please upload a PDF or image file (JPG, PNG)');
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/teaching-assistant/process-notes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMsg = 'Failed to process notes';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4 transition-colors duration-300">
      <button
        onClick={onHome}
        className="fixed top-4 left-4 bg-gray-700 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-600 transition"
      >
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto mt-8">
        {!result ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">📝 Notes Processor</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Convert your handwritten notes into organized, typed content
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 p-8 mb-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'
                }`}
              >
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Drag and drop your notes
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Upload a PDF or image (JPG, PNG) of your handwritten notes
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,image/jpeg,image/png"
                    className="hidden"
                  />
                  <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                    Choose File
                  </span>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 dark:border dark:border-blue-900 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-200">
                    <strong>Selected file:</strong> {selectedFile.name}
                  </p>
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="mt-4 w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:bg-gray-400"
                  >
                    {isProcessing ? 'Processing... Please wait' : 'Process Notes'}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-red-700 dark:text-red-200">{error}</p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 What You'll Get</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Typed and organized notes with clear structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Concise summary of the material</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Key concepts and definitions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Important takeaways (5-10 points)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    <span>Study questions to test understanding</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Tips for Best Results</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Upload clear, well-lit images of your notes</li>
                  <li>• Ensure handwriting is legible</li>
                  <li>• PDFs should be of reasonable quality</li>
                  <li>• One document per upload for best organization</li>
                  <li>• AI will flag unclear parts for you to review</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <ProcessedNotesView result={result} onReset={() => setResult(null)} />
        )}
      </div>
    </div>
  );
}

function ProcessedNotesView({
  result,
  onReset,
}: {
  result: ProcessedResult;
  onReset: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    'notes' | 'summary' | 'concepts' | 'takeaways' | 'questions'
  >('notes');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">✨ Your Processed Notes</h2>
        <p className="text-gray-600 dark:text-gray-300">Here's your organized and summarized content</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-6 bg-white dark:bg-slate-800 rounded-lg shadow p-2">
        {[
          { id: 'notes', label: '📝 Typed Notes', icon: '📝' },
          { id: 'summary', label: '📖 Summary', icon: '📖' },
          { id: 'concepts', label: '🔑 Key Concepts', icon: '🔑' },
          { id: 'takeaways', label: '💎 Takeaways', icon: '💎' },
          { id: 'questions', label: '❓ Study Questions', icon: '❓' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-6">
        {activeTab === 'notes' && (
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Typed & Organized Notes</h3>
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm bg-gray-50 dark:bg-slate-900 p-4 rounded">
              {result.typedNotes}
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Concepts</h3>
            <ul className="space-y-2">
              {result.keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-3 font-bold">▸</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'takeaways' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Takeaways</h3>
            <ol className="space-y-3">
              {result.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">{idx + 1}.</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Study Questions</h3>
            <ul className="space-y-3">
              {result.questionsToStudy.map((question, idx) => (
                <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="text-green-600 dark:text-green-400 mr-3 font-bold">Q{idx + 1}:</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        Process Another Document
      </button>
    </div>
  );
}
