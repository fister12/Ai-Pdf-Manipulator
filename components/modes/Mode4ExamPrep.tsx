'use client';

import { useState } from 'react';
import { Target, Sparkles, ClipboardList, BookOpen, Clock, CheckSquare, Lightbulb, AlertCircle, RotateCcw } from 'lucide-react';
import {
  ModeWrapper,
  ModeCard,
  ModeSectionTitle,
  ModeButton,
  ModeInput,
  ModeLoading,
  ModeError,
  ModeTabs,
} from './ModeWrapper';

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
    <ModeWrapper
      title="Exam Prep Analyzer"
      description="Upload your syllabus and PYQs to get personalized study priorities"
      icon={<Target className="h-6 w-6" />}
      onBack={onHome}
      headerColor="from-orange-500 to-orange-600"
    >
      {isProcessing ? (
        <ModeLoading text="Analyzing your content..." />
      ) : !result ? (
        <div className="space-y-6">
          <ModeCard>
            <ModeInput
              label="📚 Syllabus (paste text, PDF content, or describe topics)"
              placeholder="Paste your course syllabus or list all topics covered in your course..."
              value={syllabus}
              onChange={setSyllabus}
              type="textarea"
              rows={5}
            />

            <div className="mt-4">
              <ModeInput
                label="📋 Past Year Questions (paste previous exam papers or PYQs)"
                placeholder="Paste past year exam questions, papers, or sample questions that might appear in your exam..."
                value={pyqs}
                onChange={setPyqs}
                type="textarea"
                rows={5}
              />
            </div>

            {error && <ModeError message={error} className="mt-4" />}

            <ModeButton
              onClick={handleAnalyze}
              disabled={!syllabus.trim() && !pyqs.trim()}
              className="mt-6"
            >
              <Sparkles className="mr-2 inline h-4 w-4" />
              Analyze & Get Study Plan
            </ModeButton>
          </ModeCard>

          <div className="grid gap-6 md:grid-cols-2">
            <ModeCard>
              <ModeSectionTitle
                icon={<Target className="h-5 w-5 text-orange-500" />}
                title="How It Works"
              />
              <ul className="space-y-3 text-sm">
                {[
                  'Analyzes syllabus to identify all topics',
                  'Cross-references with past year questions',
                  'Identifies frequently asked topics',
                  'Prioritizes by marks and frequency',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ModeCard>

            <ModeCard>
              <ModeSectionTitle
                icon={<ClipboardList className="h-5 w-5 text-orange-500" />}
                title="You'll Receive"
              />
              <ul className="space-y-3 text-sm">
                {[
                  { icon: '🔴', text: 'High priority topics (must study)' },
                  { icon: '🟡', text: 'Medium priority topics (should study)' },
                  { icon: '🟢', text: 'Low priority topics (nice to know)' },
                  { icon: '📋', text: 'Last-minute revision checklist' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>{item.icon}</span>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </ModeCard>
          </div>

          <ModeCard className="border-blue-500/20 bg-blue-500/5">
            <ModeSectionTitle
              icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
              title="Pro Tips"
            />
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>For best results:</strong> Provide complete syllabus and multiple years of PYQs</li>
              <li>• <strong>Topics that appear 3+ times in PYQs</strong> are usually high priority</li>
              <li>• <strong>Last-minute revision:</strong> Use the generated checklist 2-3 days before exam</li>
              <li>• <strong>Time allocation:</strong> Follow the recommended study hours for each priority level</li>
            </ul>
          </ModeCard>
        </div>
      ) : (
        <ExamPrepResults result={result} onReset={() => setResult(null)} />
      )}
    </ModeWrapper>
  );
}

function ExamPrepResults({ result, onReset }: { result: ExamPrepResult; onReset: () => void }) {
  const [activeTab, setActiveTab] = useState('high');

  const tabs = [
    { id: 'high', label: 'High Priority', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
    { id: 'medium', label: 'Medium Priority', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
    { id: 'low', label: 'Low Priority', icon: <AlertCircle className="h-4 w-4 text-green-500" /> },
    { id: 'strategy', label: 'Exam Strategy', icon: <ClipboardList className="h-4 w-4 text-purple-500" /> },
  ];

  const priorityColors = {
    high: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-500' },
    medium: { border: 'border-yellow-500', bg: 'bg-yellow-500', text: 'text-yellow-500' },
    low: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-500' },
  };

  const renderTopicCard = (item: any, idx: number, priority: 'high' | 'medium' | 'low') => (
    <ModeCard key={idx} className={`border-l-4 ${priorityColors[priority].border}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-lg font-bold">{item.topic}</h4>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${priorityColors[priority].bg}`}>
          {item.frequency}x in PYQs
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-xs">
          Est. Marks: {item.estimatedMarks}
        </span>
      </div>
      {item.keyPoints && item.keyPoints.length > 0 && (
        <div className="mt-4 border-t border-border/50 pt-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Key Points:</p>
          <ul className="space-y-1 text-sm">
            {item.keyPoints.slice(0, 3).map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ModeCard>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">🎯 Your Exam Prep Strategy</h2>
        <p className="mt-1 text-muted-foreground">Personalized study priorities based on your syllabus and past questions</p>
      </div>

      <ModeTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'high' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-500">🔴 High Priority Topics</h3>
            <p className="text-sm text-muted-foreground">These topics appear frequently in past papers. Study these first!</p>
          </div>
          {result.analysis.highPriority.map((item, idx) => renderTopicCard(item, idx, 'high'))}
        </div>
      )}

      {activeTab === 'medium' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-yellow-500">🟡 Medium Priority Topics</h3>
            <p className="text-sm text-muted-foreground">These topics appear occasionally. Study after high priority.</p>
          </div>
          {result.analysis.mediumPriority.map((item, idx) => renderTopicCard(item, idx, 'medium'))}
        </div>
      )}

      {activeTab === 'low' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-500">🟢 Low Priority Topics</h3>
            <p className="text-sm text-muted-foreground">These are in syllabus but rarely appear. Study if you have time.</p>
          </div>
          {result.analysis.lowPriority.length > 0 ? (
            result.analysis.lowPriority.map((item, idx) => renderTopicCard(item, idx, 'low'))
          ) : (
            <ModeCard className="text-center">
              <p className="text-muted-foreground">All syllabus topics appear to be important!</p>
            </ModeCard>
          )}
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="space-y-6">
          <ModeCard>
            <ModeSectionTitle
              icon={<Clock className="h-5 w-5 text-purple-500" />}
              title="Recommended Time Allocation"
            />
            <p className="whitespace-pre-wrap text-lg font-medium">{result.analysis.timeAllocation}</p>
          </ModeCard>

          <ModeCard>
            <ModeSectionTitle
              icon={<CheckSquare className="h-5 w-5 text-purple-500" />}
              title="Last-Minute Revision Checklist"
            />
            <ul className="space-y-3">
              {result.analysis.lastMinuteChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border"
                    id={`checklist-${idx}`}
                  />
                  <label htmlFor={`checklist-${idx}`} className="cursor-pointer text-sm">
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </ModeCard>

          <ModeCard>
            <ModeSectionTitle
              icon={<Target className="h-5 w-5 text-purple-500" />}
              title="Exam Strategy"
            />
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {result.analysis.examStrategy}
            </p>
          </ModeCard>
        </div>
      )}

      <ModeButton onClick={onReset} variant="outline">
        <RotateCcw className="mr-2 inline h-4 w-4" />
        Analyze Another Exam
      </ModeButton>
    </div>
  );
}
