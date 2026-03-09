import React, { useState, useEffect } from 'react';
import { AppState, Topic } from './types';
import { ThemeControls } from './components/ThemeControls';
import { DocumentInput } from './components/DocumentInput';
import { MarkdownEditor } from './components/MarkdownEditor';
import { Dashboard } from './components/Dashboard';
import { Loader2 } from 'lucide-react';
import { reorganizeDocument, generateTopics, generateChecklist, generateQuestions, generateRiskRadar, generateSEMatrix, generateDeficiencyLetter } from './services/gemini';

export default function App() {
  const [state, setState] = useState<AppState>({
    theme: 'light',
    painterStyle: 'none',
    language: 'en',
    step: 'upload',
    markdown: '',
    topics: [],
    checklist: [],
    questions: [],
    riskRadar: [],
    seMatrix: null,
    deficiencyLetter: null,
    isLoading: false,
    loadingMessage: '',
  });

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Remove old painter theme classes
    root.className = root.className.replace(/theme-[a-z-]+/g, '').trim();
    if (state.painterStyle !== 'none') {
      root.classList.add(`theme-${state.painterStyle}`);
    }
  }, [state.theme, state.painterStyle]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleProcess = async (file: File | null, text: string) => {
    updateState({ isLoading: true, loadingMessage: 'Reorganizing document...' });
    try {
      const markdown = await reorganizeDocument(file, text, state.language);
      
      updateState({ 
        markdown: markdown || '', 
        step: 'review',
        isLoading: false 
      });
    } catch (error) {
      console.error(error);
      alert('Error processing document');
      updateState({ isLoading: false });
    }
  };

  const handleGenerateAll = async () => {
    updateState({ isLoading: true, loadingMessage: 'Generating 30 Infographics...' });
    try {
      // 1. Generate Topics
      const topics = await generateTopics(state.markdown, state.language);
      updateState({ topics });

      // 2. Generate Checklist
      updateState({ loadingMessage: 'Generating 100 Review Checklist...' });
      const checklist = await generateChecklist(state.markdown, state.language);
      updateState({ checklist });

      // 3. Generate Risk Radar
      updateState({ loadingMessage: 'Generating Regulatory Risk Radar...' });
      const riskRadar = await generateRiskRadar(state.markdown, state.language);
      updateState({ riskRadar });

      // 4. Generate SE Matrix
      updateState({ loadingMessage: 'Generating Substantial Equivalence Matrix...' });
      const seMatrix = await generateSEMatrix(state.markdown, state.language);
      updateState({ seMatrix });

      // 5. Generate FDA Letter
      updateState({ loadingMessage: 'Simulating FDA Deficiency Letter...' });
      const deficiencyLetter = await generateDeficiencyLetter(state.markdown, state.language);
      updateState({ deficiencyLetter });

      // 6. Generate Questions
      updateState({ loadingMessage: 'Generating 20 Follow-up Questions...' });
      const questions = await generateQuestions(state.markdown, state.language);
      
      updateState({ 
        questions,
        step: 'dashboard',
        isLoading: false 
      });
    } catch (error) {
      console.error(error);
      alert('Error generating content. Please try again.');
      updateState({ isLoading: false });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans transition-colors duration-300">
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] flex items-center justify-center text-white font-bold text-xl shadow-lg">
            MD
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ReguAI</h1>
        </div>
        
        <ThemeControls 
          theme={state.theme}
          setTheme={(t) => updateState({ theme: t })}
          painterStyle={state.painterStyle}
          setPainterStyle={(s) => updateState({ painterStyle: s })}
          language={state.language}
          setLanguage={(l) => updateState({ language: l })}
        />
      </header>

      <main className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        {state.step === 'upload' && (
          <DocumentInput onProcess={handleProcess} isLoading={state.isLoading} />
        )}

        {state.step === 'review' && (
          <MarkdownEditor 
            markdown={state.markdown} 
            setMarkdown={(md) => updateState({ markdown: md })}
            onGenerate={handleGenerateAll}
            isLoading={state.isLoading}
          />
        )}

        {state.step === 'dashboard' && (
          <Dashboard 
            state={state} 
            onBack={() => updateState({ step: 'review' })} 
          />
        )}
      </main>

      {state.isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-[var(--border-color)]">
            <Loader2 className="w-12 h-12 text-[var(--primary-color)] animate-spin" />
            <p className="text-xl font-bold animate-pulse">{state.loadingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
