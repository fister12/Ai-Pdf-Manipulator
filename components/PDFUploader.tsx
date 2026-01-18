'use client';

import { useCallback, useState } from 'react';

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function PDFUploader({ onFileSelect }: PDFUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFileName(file.name);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFileName(file.name);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, [onFileSelect]);

  return (
    <label htmlFor="file-input" className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition ${dragActive ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'}`} onDrag={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
      <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Drag and drop your PDF here</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">or click to select a file</p>
        {selectedFileName && <p className="text-sm font-mono text-green-600 dark:text-green-400 mt-3">✓ {selectedFileName}</p>}
      </div>
      <input id="file-input" type="file" className="hidden" accept=".pdf" onChange={handleChange} />
    </label>
  );
}
