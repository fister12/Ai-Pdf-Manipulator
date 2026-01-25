'use client';

import { useState } from 'react';
import { FileText, Upload, BookOpen, Lightbulb, HelpCircle, Sparkles, FileCheck } from 'lucide-react';
import {
  ModeWrapper,
  ModeCard,
  ModeSectionTitle,
  ModeButton,
  ModeDropZone,
  ModeLoading,
  ModeError,
  ModeTabs,
} from './ModeWrapper';

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

  const handleDrop = (files: FileList) => {
    setIsDragging(false);
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
    <ModeWrapper
      title="Notes Processor"
      description="Convert your handwritten notes into organized, typed content"
      icon={<FileText className="h-6 w-6" />}
      onBack={onHome}
      headerColor="from-blue-500 to-blue-600"
    >
      {isProcessing ? (
        <ModeLoading text="Processing your notes with AI..." />
      ) : !result ? (
        <div className="space-y-6">
          {/* Drop Zone */}
          <ModeCard>
            <ModeDropZone
              onDrop={handleDrop}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Drag and drop your notes
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Upload a PDF or image (JPG, PNG) of your handwritten notes
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,image/jpeg,image/png"
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary/90">
                    <Upload className="h-4 w-4" />
                    Choose File
                  </span>
                </label>
              </div>
            </ModeDropZone>

            {selectedFile && (
              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <ModeButton onClick={handleProcess} className="mt-4">
                  <Sparkles className="mr-2 inline h-4 w-4" />
                  Process Notes with AI
                </ModeButton>
              </div>
            )}

            {error && <ModeError message={error} />}
          </ModeCard>

          {/* Info Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <ModeCard>
              <ModeSectionTitle
                icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                title="What You'll Get"
              />
              <ul className="space-y-3 text-sm">
                {[
                  'Typed and organized notes with clear structure',
                  'Concise summary of the material',
                  'Key concepts and definitions',
                  'Important takeaways (5-10 points)',
                  'Study questions to test understanding',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ModeCard>

            <ModeCard>
              <ModeSectionTitle
                icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
                title="Tips for Best Results"
              />
              <ul className="space-y-3 text-sm">
                {[
                  'Upload clear, well-lit images of your notes',
                  'Ensure handwriting is legible',
                  'PDFs should be of reasonable quality',
                  'One document per upload for best organization',
                  'AI will flag unclear parts for you to review',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ModeCard>
          </div>
        </div>
      ) : (
        <ProcessedNotesView result={result} onReset={() => setResult(null)} />
      )}
    </ModeWrapper>
  );
}

function ProcessedNotesView({
  result,
  onReset,
}: {
  result: ProcessedResult;
  onReset: () => void;
}) {
  const [activeTab, setActiveTab] = useState('notes');

  const tabs = [
    { id: 'notes', label: 'Typed Notes', icon: <FileText className="h-4 w-4" /> },
    { id: 'summary', label: 'Summary', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'concepts', label: 'Key Concepts', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'takeaways', label: 'Takeaways', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'questions', label: 'Study Questions', icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">✨ Your Processed Notes</h2>
        <p className="mt-1 text-muted-foreground">Here's your organized and summarized content</p>
      </div>

      <ModeTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <ModeCard className="min-h-[300px]">
        {activeTab === 'notes' && (
          <div>
            <ModeSectionTitle title="Typed & Organized Notes" />
            <div className="whitespace-pre-wrap rounded-xl bg-muted/50 p-4 font-mono text-sm">
              {result.typedNotes}
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <ModeSectionTitle title="Summary" />
            <p className="leading-relaxed text-muted-foreground">{result.summary}</p>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div>
            <ModeSectionTitle title="Key Concepts" />
            <ul className="space-y-2">
              {result.keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'takeaways' && (
          <div>
            <ModeSectionTitle title="Key Takeaways" />
            <ol className="space-y-3">
              {result.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <ModeSectionTitle title="Study Questions" />
            <ul className="space-y-3">
              {result.questionsToStudy.map((question, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl bg-muted/50 p-3">
                  <span className="font-bold text-green-600 dark:text-green-400">Q{idx + 1}:</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ModeCard>

      <ModeButton onClick={onReset} variant="outline">
        Process Another Document
      </ModeButton>
    </div>
  );
}
