import { z } from 'zod';

// Common file validation schema
export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, {
    message: 'File cannot be empty',
  })
  .refine((file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    return allowedTypes.includes(file.type);
  }, {
    message: 'Only PDF, JPG, and PNG files are supported',
  });

// Common workflow validation schema
export const workflowIdSchema = z.enum([
  'handwritten_to_typed',
  'notes_cleanup',
  'summary_extraction',
  'study_guide',
  'report_generation',
  'text_extraction',
  'teaching_assistant_notes',
  'teaching_assistant_flashcards',
  'teaching_assistant_study_mode',
  'teaching_assistant_topic_graph',
  'teaching_assistant_exam_prep',
  'teaching_assistant_generate_study_points',
]);

// Common model ID validation schema
export const modelIdSchema = z.string().optional().default('gemini-2.5-flash');

// Common API request schema for file uploads
export const fileUploadSchema = z.object({
  file: fileSchema,
  workflowId: workflowIdSchema,
  modelId: modelIdSchema,
});

// Common API request schema for text input
export const textInputSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty'),
  workflowId: workflowIdSchema,
  modelId: modelIdSchema,
});

// Exam prep schema (syllabus and past year questions)
export const examPrepSchema = z.object({
  syllabus: z.string().min(1, 'Syllabus cannot be empty'),
  pastYearQuestions: z.string().min(1, 'Past year questions cannot be empty'),
  workflowId: workflowIdSchema.optional(),
  modelId: modelIdSchema.optional(),
});

// Flashcard schema
export const flashcardSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  workflowId: workflowIdSchema.optional(),
  modelId: modelIdSchema.optional(),
});

// Study mode schema
export const studyModeSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  workflowId: workflowIdSchema.optional(),
  modelId: modelIdSchema.optional(),
});

// Topic graph schema
export const topicGraphSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty'),
  workflowId: workflowIdSchema.optional(),
  modelId: modelIdSchema.optional(),
});

// Chat schema
export const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  sessionId: z.string().optional(),
  modelId: modelIdSchema.optional(),
});

// Utility function to validate and extract request data
export const validateRequest = async <T extends z.ZodTypeAny>(
  request: Request,
  schema: T
) => {
  const formData = await request.formData();
  const result = schema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message } as const;
  }
  
  return { success: true, data: result.data } as const;
};