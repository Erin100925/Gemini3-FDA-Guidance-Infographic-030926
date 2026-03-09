import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight } from 'lucide-react';

interface DocumentInputProps {
  onProcess: (file: File | null, text: string) => void;
  isLoading: boolean;
}

export function DocumentInput({ onProcess, isLoading }: DocumentInputProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file || text.trim()) {
      onProcess(file, text);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)]">
      <h2 className="text-3xl font-bold mb-6 text-center font-sans">
        Medical Device Premarket Review
      </h2>
      <p className="text-center text-[var(--secondary-color)] mb-8 max-w-2xl mx-auto">
        Upload your 510(k) summary, guidance document, or paste the text directly. 
        Our AI will reorganize it and generate 30 stunning infographics, a 100-point checklist, and 20 follow-up questions.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div 
          className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.txt,.md" 
            onChange={handleFileChange}
          />
          <Upload size={48} className="text-[var(--primary-color)] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
          <p className="text-sm text-[var(--secondary-color)]">
            {file ? file.name : 'Drag & drop PDF, TXT, or MD here, or click to browse'}
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-[var(--primary-color)]" />
            <h3 className="text-xl font-semibold">Or Paste Text</h3>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your medical device guidance or summary here..."
            className="flex-1 w-full p-4 rounded-xl border border-[var(--border-color)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] resize-none"
            rows={8}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading || (!file && !text.trim())}
          className="flex items-center gap-2 px-8 py-4 bg-[var(--primary-color)] text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? 'Processing...' : 'Analyze Document'}
          {!isLoading && <ArrowRight size={24} />}
        </button>
      </div>
    </div>
  );
}
