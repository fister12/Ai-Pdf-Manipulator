'use client';

import { useState } from 'react';
import { getAllWorkflows } from '@/lib/prompts';
import PDFUploader from './PDFUploader';
import WorkflowSelector from './WorkflowSelector';
import ProcessingStatus from './ProcessingStatus';
import type { WorkflowId } from '@/lib/prompts';

export default function LandingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const workflows = getAllWorkflows();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setProcessedText(null);
    setShowSelector(true);
  };

  const handleWorkflowSelect = async (workflowId: WorkflowId) => {
    if (!selectedFile) return;

    setSelectedWorkflow(workflowId);
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('workflowId', workflowId);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const data = await response.json();
      setProcessedText(data.processedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedWorkflow(null);
    setProcessedText(null);
    setError(null);
    setShowSelector(false);
  };

  const handleCopyText = () => {
    if (processedText) {
      navigator.clipboard.writeText(processedText);
      alert('Text copied to clipboard!');
    }
  };

  const handleDownloadText = () => {
    if (processedText) {
      const element = document.createElement('a');
      const file = new Blob([processedText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'processed-notes.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Notes Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Transform your handwritten or typed PDFs into organized, clean text
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {/* Step 1: File Upload */}
          {!selectedFile && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Step 1: Upload Your PDF
              </h2>
              <PDFUploader onFileSelect={handleFileSelect} />
            </div>
          )}

          {/* Step 2: Workflow Selection */}
          {selectedFile && showSelector && !processedText && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Step 2: Choose Processing Workflow
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Selected file: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{selectedFile.name}</span>
                </p>
              </div>
              <WorkflowSelector
                workflows={workflows}
                onSelect={handleWorkflowSelect}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <ProcessingStatus
              isProcessing={isProcessing}
              error={error}
              processedText={null}
              currentWorkflow={selectedWorkflow}
            />
          )}

          {/* Results */}
          {processedText && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Step 3: Your Processed Notes
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap font-sans leading-relaxed">
                  {processedText}
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleCopyText}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={handleDownloadText}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  Download as Text
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                >
                  Process Another File
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && !isProcessing && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
              <h3 className="text-red-900 dark:text-red-200 font-semibold mb-2">Error</h3>
              <p className="text-red-800 dark:text-red-300">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📝 Supported Workflows
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {workflows.slice(0, 3).map((w) => (
                <li key={w.id} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>{w.name}:</strong> {w.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              ✨ Features
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>AI-powered text recognition</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Multiple processing workflows</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Easy copy & download options</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
