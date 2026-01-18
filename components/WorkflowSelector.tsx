'use client';

import type { WorkflowId } from '@/lib/prompts';

interface Workflow {
  id: WorkflowId;
  name: string;
  description: string;
  prompt: string;
}

interface WorkflowSelectorProps {
  workflows: Workflow[];
  onSelect: (workflowId: WorkflowId) => void;
  isProcessing: boolean;
}

export default function WorkflowSelector({
  workflows,
  onSelect,
  isProcessing,
}: WorkflowSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workflows.map((workflow) => (
        <button
          key={workflow.id}
          onClick={() => onSelect(workflow.id)}
          disabled={isProcessing}
          className="text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {workflow.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {workflow.description}
          </p>
        </button>
      ))}
    </div>
  );
}
