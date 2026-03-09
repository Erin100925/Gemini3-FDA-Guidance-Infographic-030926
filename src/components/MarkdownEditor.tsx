import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Edit3, Eye, ArrowRight } from 'lucide-react';

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function MarkdownEditor({ markdown, setMarkdown, onGenerate, isLoading }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[80vh] bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
        <h2 className="text-2xl font-bold font-sans flex items-center gap-3">
          Reorganized Document
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[var(--bg-color)] rounded-lg p-1 border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${viewMode === 'edit' ? 'bg-[var(--primary-color)] text-white shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              <Edit3 size={18} /> Edit
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-[var(--primary-color)] text-white shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              <Eye size={18} /> Preview
            </button>
          </div>
          
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-color)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
          >
            {isLoading ? 'Generating...' : 'Generate Infographics & Checklist'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'edit' ? (
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full p-8 bg-transparent focus:outline-none resize-none font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="w-full h-full p-8 overflow-y-auto prose prose-slate dark:prose-invert max-w-none">
            <Markdown>{markdown}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
