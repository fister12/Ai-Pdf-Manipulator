'use client';

import { useState, useEffect, useRef } from 'react';

interface TopicGraphProps {
  topic: string;
  description?: string;
  flashcards?: any[];
}

interface VisualizationData {
  mainTopic: string;
  visualization: {
    type: string;
    layout: string;
    description: string;
  };
  concepts: Array<{
    name: string;
    definition: string;
    difficulty: string;
    color: string;
    connections: string[];
    memoryAid: string;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    relationship: string;
    explanation: string;
  }>;
  visualizationGuide: string;
}

export default function TopicGraphVisualizer({ topic, description, flashcards }: TopicGraphProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateTopicGraph = async () => {
    setIsGenerating(true);
    setError(null);
    setShowVisualization(true);

    try {
      const response = await fetch('/api/teaching-assistant/generate-topic-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          description,
          flashcards,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate topic graph');
      }

      const data = await response.json();
      setVisualizationData(data.visualization);

      // Generate SVG visualization
      const svg = createConceptMapSVG(data.visualization);
      setImageUrl(svg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate graph');
      // Still generate a fallback visualization
      const svg = createFallbackVisualization(topic, flashcards || []);
      setImageUrl(svg);
    } finally {
      setIsGenerating(false);
    }
  };

  const createConceptMapSVG = (data: VisualizationData['visualization']): string => {
    const width = 1000;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e0f2fe;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.4"/>
        </filter>
        <style>
          .main-title { font-size: 28px; font-weight: bold; text-anchor: middle; fill: #1e293b; }
          .concept-label { font-size: 14px; font-weight: 600; text-anchor: middle; dominant-baseline: middle; }
          .connector-line { stroke-width: 2.5; fill: none; stroke-dasharray: 5,3; opacity: 0.7; }
          .concept-circle { filter: url(#shadow); }
          .info-text { font-size: 11px; text-anchor: middle; fill: #64748b; }
        </style>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>`;

    // Add grid pattern
    svg += `<defs>
      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.4"/>`;

    // Draw center node using the topic parameter
    const centerTopic = topic;
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="65" fill="#667eea" class="concept-circle"/>
      <circle cx="${centerX}" cy="${centerY}" r="62" fill="white" stroke="#667eea" stroke-width="2"/>
      <text x="${centerX}" y="${centerY - 10}" class="main-title">${escapeXml(centerTopic)}</text>
      <text x="${centerX}" y="${centerY + 20}" class="info-text">(Main Topic)</text>`;

    // Draw surrounding concepts (simplified visualization)
    const conceptCount = 6;
    for (let i = 0; i < conceptCount; i++) {
      const angle = (i / conceptCount) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
      const nodeColor = colors[i % colors.length];
      const labels = ['Concept 1', 'Concept 2', 'Concept 3', 'Concept 4', 'Concept 5', 'Concept 6'];

      // Draw connecting line
      svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" class="connector-line" stroke="${nodeColor}"/>`;

      // Draw concept node
      svg += `
        <circle cx="${x}" cy="${y}" r="50" fill="${nodeColor}" class="concept-circle" opacity="0.9"/>
        <circle cx="${x}" cy="${y}" r="47" fill="white" stroke="${nodeColor}" stroke-width="2"/>
        <text x="${x}" y="${y}" class="concept-label" fill="${nodeColor}">
          ${labels[i]}
        </text>`;
    }

    svg += `</svg>`;
    return svg;
  };

  const createFallbackVisualization = (centerTopic: string, cards: any[]): string => {
    const width = 1000;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bgGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#faf5ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f3e8ff;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow2" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.4"/>
        </filter>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#bgGradient2)"/>`;

    // Center circle
    svg += `<circle cx="${centerX}" cy="${centerY}" r="70" fill="#a855f7" filter="url(#shadow2)"/>
      <circle cx="${centerX}" cy="${centerY}" r="67" fill="white" stroke="#a855f7" stroke-width="2"/>
      <text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="bold" fill="#a855f7">
        ${escapeXml(centerTopic)}
      </text>`;

    // Draw concepts from flashcards
    const conceptCount = Math.min(cards.length, 8);
    cards.slice(0, conceptCount).forEach((card, i) => {
      const angle = (i / conceptCount) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
      const nodeColor = colors[i % colors.length];
      const label = card.question.substring(0, 18) + '...';
      const difficulty = card.difficulty === 'easy' ? '🟢' : card.difficulty === 'medium' ? '🟡' : '🔴';

      // Connecting line
      svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke-width="2" stroke="${nodeColor}" fill="none" stroke-dasharray="5,3" opacity="0.6"/>`;

      // Concept node
      svg += `<circle cx="${x}" cy="${y}" r="52" fill="${nodeColor}" filter="url(#shadow2)" opacity="0.85"/>
        <circle cx="${x}" cy="${y}" r="49" fill="white" stroke="${nodeColor}" stroke-width="2"/>
        <text x="${x}" y="${y - 12}" text-anchor="middle" font-size="13" font-weight="600" fill="${nodeColor}">
          ${escapeXml(label)}
        </text>
        <text x="${x}" y="${y + 12}" text-anchor="middle" font-size="16">
          ${difficulty}
        </text>`;
    });

    svg += `</svg>`;
    return svg;
  };

  const createDataURLFromSVG = (svgString: string): string => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  const downloadAsPNG = async () => {
    if (!imageUrl) return;

    try {
      // Get the SVG data URL
      const svgBlob = new Blob([imageUrl], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create an image element to convert SVG to canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          // Download PNG
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `${topic}-topic-graph.png`;
              link.click();
              URL.revokeObjectURL(link.href);
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (err) {
      setError('Failed to download image as PNG');
    }
  };

  const downloadAsSVG = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${topic}-topic-graph.svg`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          📊 Topic Visualization & Graph
        </h3>
        <button
          onClick={generateTopicGraph}
          disabled={isGenerating}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600 font-semibold"
        >
          {isGenerating ? '⏳ Generating...' : '🎨 Generate Visualization'}
        </button>
      </div>

      {showVisualization && isGenerating && (
        <div className="text-center py-16">
          <div className="inline-block">
            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">Generating your topic visualization...</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">This may take a moment</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg mb-4">
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">{error}</p>
          <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">Using fallback visualization</p>
        </div>
      )}

      {imageUrl && !isGenerating && showVisualization && (
        <div className="space-y-4">
          <div className="border-4 border-purple-300 dark:border-purple-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-lg">
            <img
              src={createDataURLFromSVG(imageUrl)}
              alt={`${topic} Topic Graph`}
              className="w-full h-auto"
            />
          </div>

          {visualizationData && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📋 Visualization Type</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm capitalize">
                  {visualizationData.visualization.type.replace(/_/g, ' ')} - {visualizationData.visualization.layout} Layout
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-2 italic">{visualizationData.visualization.description}</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">💡 Study Guide</h4>
                <p className="text-green-800 dark:text-green-200 text-sm">{visualizationData.visualizationGuide.substring(0, 150)}...</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={downloadAsPNG}
              className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-semibold"
            >
              📥 Download as PNG
            </button>
            <button
              onClick={downloadAsSVG}
              className="flex-1 px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-semibold"
            >
              📥 Download as SVG
            </button>
          </div>
        </div>
      )}

      {!showVisualization && (
        <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Click the button above to generate an AI-powered visual representation of this topic
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The visualization will show concept relationships and help with memorization
          </p>
        </div>
      )}
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
