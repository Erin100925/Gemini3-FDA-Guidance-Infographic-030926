import React, { useState } from 'react';
import { AppState } from '../types';
import { InfographicCard } from './InfographicCard';
import { CheckCircle2, HelpCircle, FileText, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onBack: () => void;
}

export function Dashboard({ state, onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'infographics' | 'checklist' | 'questions'>('infographics');

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen pb-20">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium shadow-sm"
        >
          <ArrowLeft size={20} /> Back to Editor
        </button>
        <h1 className="text-3xl font-bold font-sans text-center flex-1">
          {state.language === 'en' ? 'Regulatory Analysis Dashboard' : '法規分析儀表板'}
        </h1>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <TabButton 
          active={activeTab === 'infographics'} 
          onClick={() => setActiveTab('infographics')}
          icon={<FileText size={20} />}
          label={state.language === 'en' ? '30 Infographics' : '30 圖像化圖表'}
          count={state.topics.length}
        />
        <TabButton 
          active={activeTab === 'checklist'} 
          onClick={() => setActiveTab('checklist')}
          icon={<CheckCircle2 size={20} />}
          label={state.language === 'en' ? '100 Review Checklist' : '100 項審查清單'}
          count={state.checklist.length}
        />
        <TabButton 
          active={activeTab === 'questions'} 
          onClick={() => setActiveTab('questions')}
          icon={<HelpCircle size={20} />}
          label={state.language === 'en' ? '20 Follow-up Questions' : '20 個後續問題'}
          count={state.questions.length}
        />
      </div>

      {activeTab === 'infographics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.topics.map((topic) => (
            <InfographicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-4xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--primary-color)]">
            <CheckCircle2 size={28} />
            {state.language === 'en' ? 'Comprehensive Review Checklist' : '綜合審查清單'}
          </h2>
          <div className="space-y-4">
            {state.checklist.map((item, idx) => (
              <label key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-[var(--border-color)]">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-transparent" />
                <span className="text-lg leading-relaxed">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-4xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--accent-color)]">
            <HelpCircle size={28} />
            {state.language === 'en' ? 'Follow-up Questions' : '後續問題'}
          </h2>
          <div className="space-y-6">
            {state.questions.map((question, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border-l-4 border-[var(--accent-color)]">
                <div className="font-bold text-xl text-[var(--secondary-color)] w-8 flex-shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <p className="text-lg leading-relaxed font-medium">{question}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
        active 
          ? 'bg-[var(--primary-color)] text-white shadow-lg scale-105' 
          : 'bg-[var(--card-bg)] text-[var(--text-color)] border border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
      <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-[var(--primary-color)] text-white'}`}>
        {count}
      </span>
    </button>
  );
}
