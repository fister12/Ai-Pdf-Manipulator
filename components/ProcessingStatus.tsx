'use client';

import type { WorkflowId } from '@/lib/prompts';
import { getWorkflowName } from '@/lib/prompts';

interface ProcessingStatusProps {
  isProcessing: boolean;
  error: string | null;
  processedText: string | null;
  onDownload?: () => void;
  currentWorkflow?: WorkflowId | null;
}

export default function ProcessingStatus({
  isProcessing,
  error,
  processedText,
  onDownload,
  currentWorkflow,
}: ProcessingStatusProps) {
  if (isProcessing) {
    const workflowName = currentWorkflow ? getWorkflowName(currentWorkflow) : 'processing';
    return (
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200">Processing your document...</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              AI is {workflowName.toLowerCase()} your notes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
