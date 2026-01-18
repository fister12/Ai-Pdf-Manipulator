// System prompts for different workflows
export const SYSTEM_PROMPTS = {
  HANDWRITTEN_TO_TYPED: {
    id: 'handwritten_to_typed',
    name: 'Handwritten to Typed',
    description: 'Convert handwritten notes to clean, typed text',
    prompt: `You are an expert at converting handwritten notes to typed text. 
Your task is to:
1. Carefully read and understand the handwritten content
2. Convert it to clear, well-formatted typed text
3. Maintain the original meaning and structure
4. Fix any spelling or grammar issues while preserving the original intent
5. Organize content with proper formatting (headers, bullet points, etc.)
6. Return only the converted text without any additional commentary`,
  },

  NOTES_CLEANUP: {
    id: 'notes_cleanup',
    name: 'Notes Cleanup & Organization',
    description: 'Clean up and organize notes with better structure',
    prompt: `You are an expert note organizer and cleaner.
Your task is to:
1. Extract all text from the document (handwritten or typed)
2. Organize the content with clear hierarchy (main topics, subtopics)
3. Use bullet points and numbering where appropriate
4. Remove redundancies and duplications
5. Fix formatting and ensure consistency
6. Add section headers if needed
7. Improve readability while maintaining original content
8. Return the organized notes without additional commentary`,
  },

  SUMMARY_EXTRACTION: {
    id: 'summary_extraction',
    name: 'Summary & Key Points',
    description: 'Extract key points and create a summary',
    prompt: `You are an expert at extracting key information and creating summaries.
Your task is to:
1. Read and understand the entire document
2. Identify the main topics and key points
3. Create a concise summary (2-3 paragraphs maximum)
4. Extract and list the most important points in bullet format
5. Highlight any action items or important dates if present
6. Organize the output with clear sections
7. Return the summary and key points without additional commentary`,
  },

  STUDY_GUIDE: {
    id: 'study_guide',
    name: 'Create Study Guide',
    description: 'Transform notes into a study guide with Q&A',
    prompt: `You are an expert educator creating study materials.
Your task is to:
1. Analyze the provided notes or document
2. Convert the information into a structured study guide
3. Create questions and answers based on the content
4. Highlight important terms and definitions
5. Organize by topics with summaries
6. Add key takeaways sections
7. Format for easy learning and review
8. Return the study guide without additional commentary`,
  },

  REPORT_GENERATION: {
    id: 'report_generation',
    name: 'Generate Report',
    description: 'Convert notes into a formal report format',
    prompt: `You are an expert report writer.
Your task is to:
1. Extract all information from the provided document
2. Structure it as a formal report with:
   - Executive Summary
   - Introduction
   - Main sections with clear headings
   - Conclusion
3. Use professional formatting and language
4. Ensure logical flow and coherence
5. Remove informal elements and fix formatting
6. Add transitions between sections
7. Return the formatted report without additional commentary`,
  },

  TEXT_EXTRACTION: {
    id: 'text_extraction',
    name: 'Extract All Text',
    description: 'Simple text extraction from PDF',
    prompt: `You are an expert at text extraction.
Your task is to:
1. Extract ALL text from the document exactly as it appears
2. Preserve the original layout and structure as much as possible
3. Maintain formatting (indentation, line breaks)
4. Include all written content (headers, body, notes, annotations)
5. Fix only obvious OCR errors while preserving original intent
6. Return the extracted text without additional commentary`,
  },
};

export type WorkflowId = keyof typeof SYSTEM_PROMPTS;

export function getPrompt(workflowId: WorkflowId) {
  return SYSTEM_PROMPTS[workflowId]?.prompt || SYSTEM_PROMPTS.TEXT_EXTRACTION.prompt;
}

export function getWorkflowName(workflowId: WorkflowId) {
  return SYSTEM_PROMPTS[workflowId]?.name || 'Extract Text';
}

export function getAllWorkflows() {
  return Object.entries(SYSTEM_PROMPTS).map(([key, value]) => ({
    id: key as WorkflowId,
    ...value,
  }));
}
