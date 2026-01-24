'use client';

import { useState, useEffect } from 'react';

interface ConceptMapProps {
  topic: string;
  flashcards: any[];
}

export default function ConceptMapDiagram({ topic, flashcards }: ConceptMapProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  useEffect(() => {
    generateConceptMap();
  }, [topic, flashcards]);

  const generateConceptMap = () => {
    const map = createInteractiveConceptMap(topic, flashcards);
    setSvgContent(map);
  };

  const createInteractiveConceptMap = (centerTopic: string, cards: any[]): string => {
    const width = 900;
    const height = 700;
    const centerX = width / 2;
    const centerY = height / 2;

    const colors = {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      light: '#f5f7fa',
      text: '#2d3748',
    };

    const uniqueConcepts = cards.slice(0, 6).map((card, i) => ({
      id: i,
      title: card.question.substring(0, 20) + '...',
      difficulty: card.difficulty,
    }));

    const getColorByDifficulty = (difficulty: string) => {
      switch (difficulty) {
        case 'easy':
          return '#10b981';
        case 'medium':
          return '#f59e0b';
        case 'hard':
          return '#ef4444';
        default:
          return '#6366f1';
      }
    };

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e0f2fe;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
        <style>
          .main-topic { font-size: 24px; font-weight: bold; text-anchor: middle; }
          .concept-label { font-size: 12px; font-weight: 600; text-anchor: middle; dominant-baseline: middle; }
          .connector-line { stroke-width: 2; fill: none; stroke-dasharray: 4,2; opacity: 0.6; }
          .concept-circle { filter: url(#shadow); }
        </style>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      
      <!-- Grid pattern -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.3"/>`;

    // Draw connections from center
    uniqueConcepts.forEach((concept, i) => {
      const angle = (i / uniqueConcepts.length) * 2 * Math.PI - Math.PI / 2;
      const distance = 180;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);

      svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" class="connector-line" stroke="${colors.primary}"/>`;
    });

    // Draw center topic
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="60" fill="${colors.primary}" class="concept-circle"/>
      <circle cx="${centerX}" cy="${centerY}" r="57" fill="white"/>
      <text x="${centerX}" y="${centerY}" class="main-topic" fill="${colors.primary}">
        ${escapeXml(centerTopic)}
      </text>`;

    // Draw concept nodes
    uniqueConcepts.forEach((concept, i) => {
      const angle = (i / uniqueConcepts.length) * 2 * Math.PI - Math.PI / 2;
      const distance = 180;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      const nodeRadius = 45;
      const nodeColor = getColorByDifficulty(concept.difficulty);

      svg += `
        <circle cx="${x}" cy="${y}" r="${nodeRadius}" fill="${nodeColor}" class="concept-circle" opacity="0.9"/>
        <circle cx="${x}" cy="${y}" r="${nodeRadius - 3}" fill="white"/>
        <text x="${x}" y="${y - 8}" class="concept-label" fill="${nodeColor}" font-weight="bold">
          ${escapeXml(concept.title)}
        </text>
        <text x="${x}" y="${y + 8}" class="concept-label" fill="${colors.text}" font-size="10">
          ${concept.difficulty.toUpperCase()}
        </text>`;
    });

    svg += `</svg>`;
    return svg;
  };

  const createDataURLFromSVG = (svgString: string): string => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        🗺️ Concept Map Diagram
      </h3>

      <div className="border-2 border-blue-200 dark:border-blue-700 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
        {svgContent && (
          <img
            src={createDataURLFromSVG(svgContent)}
            alt={`${topic} Concept Map`}
            className="w-full h-auto"
          />
        )}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-semibold">📌 Difficulty Levels:</span> 
          <span className="ml-4 inline-flex gap-4">
            <span>🟢 Easy</span>
            <span>🟡 Medium</span>
            <span>🔴 Hard</span>
          </span>
        </p>
      </div>
    </div>
  );
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
