'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, BookOpen, MessageSquare, Send, ChevronRight, Lightbulb, CheckCircle } from 'lucide-react';
import {
  ModeWrapper,
  ModeCard,
  ModeSectionTitle,
  ModeButton,
  ModeInput,
  ModeLoading,
  ModeError,
} from './ModeWrapper';

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
    <ModeWrapper
      title="Study Mode"
      description="50% Teaching + 50% Questioning for deep learning"
      icon={<Brain className="h-6 w-6" />}
      onBack={onHome}
      headerColor="from-green-500 to-green-600"
    >
      {isProcessing ? (
        <ModeLoading text="Starting your study session..." />
      ) : !studyStarted ? (
        <div className="space-y-6">
          <ModeCard>
            <ModeInput
              label="What topic would you like to study?"
              placeholder="e.g., 'Photosynthesis', 'Algebra Basics', 'French Grammar'"
              value={topic}
              onChange={setTopic}
            />

            <div className="mt-4">
              <ModeInput
                label="Study Material (optional)"
                placeholder="Paste your study notes, lecture slides, or textbook excerpts here. This helps the AI teach from your specific material."
                value={material}
                onChange={setMaterial}
                type="textarea"
                rows={5}
              />
            </div>

            {error && <ModeError message={error} className="mt-4" />}

            <ModeButton
              onClick={handleStartStudy}
              disabled={!topic.trim()}
              className="mt-6"
            >
              <Sparkles className="mr-2 inline h-4 w-4" />
              Start Study Session
            </ModeButton>
          </ModeCard>

          <div className="grid gap-6 md:grid-cols-2">
            <ModeCard>
              <ModeSectionTitle
                icon={<BookOpen className="h-5 w-5 text-green-500" />}
                title="Socratic Method Approach"
              />
              <ul className="space-y-3 text-sm">
                {[
                  'Teacher explains concepts (50%)',
                  'You answer guided questions (50%)',
                  'Progressive difficulty levels',
                  'Learn through active thinking',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </ModeCard>

            <ModeCard>
              <ModeSectionTitle
                icon={<MessageSquare className="h-5 w-5 text-green-500" />}
                title="Study Session Structure"
              />
              <ol className="space-y-3 text-sm">
                {[
                  { step: 'Teaching', desc: 'Learn a concept' },
                  { step: 'Question', desc: 'Apply your knowledge' },
                  { step: 'Feedback', desc: 'Get corrections' },
                  { step: 'Repeat', desc: 'Continue with new topics' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600 dark:bg-green-900 dark:text-green-400">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{item.step}</strong> - {item.desc}
                    </span>
                  </li>
                ))}
              </ol>
            </ModeCard>
          </div>

          <ModeCard className="border-blue-500/20 bg-blue-500/5">
            <ModeSectionTitle
              icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
              title="Pro Tips"
            />
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Without material:</strong> AI will teach from general knowledge of the topic</li>
              <li>• <strong>With material:</strong> AI will teach specifically from your notes or textbook</li>
              <li>• <strong>Best results:</strong> Paste your actual class notes for most relevant teaching</li>
              <li>• <strong>Interactive:</strong> Your answers shape how the AI continues teaching</li>
            </ul>
          </ModeCard>
        </div>
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
    </ModeWrapper>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

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

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentPointIndex < studyPoints.length - 1) {
      setCurrentPointIndex(currentPointIndex + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setFeedback('');
    } else {
      onEnd();
    }
  };

  if (isLoading && studyPoints.length === 0) {
    return <ModeLoading text="Preparing your study session..." />;
  }

  if (studyPoints.length === 0) {
    return (
      <div className="text-center py-12">
        <ModeError message={error || 'Failed to load study content'} onRetry={onEnd} />
      </div>
    );
  }

  const currentPoint = studyPoints[currentPointIndex];
  const progress = ((currentPointIndex + 1) / studyPoints.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Study Session: {topic}</h2>
        <p className="mt-1 text-muted-foreground">
          Question {currentPointIndex + 1} of {studyPoints.length}
        </p>
        <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Teaching Point */}
      <ModeCard className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
              Teaching Point
            </h3>
            <p className="text-lg leading-relaxed">{currentPoint.teachingPoint}</p>
          </div>
        </div>
      </ModeCard>

      {/* Question & Answer */}
      <ModeCard className="border-primary/30">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
              Your Turn
            </h3>
            <p className="mb-4 text-lg font-medium">{currentPoint.question}</p>

            {!isAnswered ? (
              <>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="mb-4 h-32 w-full resize-none rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {error && <ModeError message={error} />}
                <ModeButton onClick={handleSubmitAnswer} disabled={isSubmitting || !userAnswer.trim()}>
                  {isSubmitting ? (
                    'Evaluating...'
                  ) : (
                    <>
                      <Send className="mr-2 inline h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </ModeButton>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-blue-500/10 p-4">
                  <h4 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">Your Answer:</h4>
                  <p className="text-muted-foreground">{userAnswer}</p>
                </div>

                <div className="rounded-xl bg-green-500/10 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Feedback
                  </h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{feedback}</p>
                </div>

                <ModeButton onClick={handleNext}>
                  {currentPointIndex < studyPoints.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight className="ml-2 inline h-4 w-4" />
                    </>
                  ) : (
                    'Complete Study Session'
                  )}
                </ModeButton>
              </div>
            )}
          </div>
        </div>
      </ModeCard>

      {/* End early button */}
      <ModeButton onClick={onEnd} variant="outline">
        End Session Early
      </ModeButton>

      {/* Tips */}
      <ModeCard>
        <ModeSectionTitle
          icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
          title="Study Tips"
        />
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Think carefully before answering - there's no time limit</li>
          <li>• Try to explain your reasoning, not just the answer</li>
          <li>• Feedback will help you understand the concept better</li>
          <li>• Feel free to ask follow-up questions through your answers</li>
        </ul>
      </ModeCard>
    </div>
  );
}
