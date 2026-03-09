import React from 'react';
import { Moon, Sun, Palette, Globe } from 'lucide-react';

interface ThemeControlsProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  painterStyle: string;
  setPainterStyle: (s: string) => void;
  language: 'en' | 'zh';
  setLanguage: (l: 'en' | 'zh') => void;
}

const PAINTERS = [
  'none', 'van-gogh', 'monet', 'picasso', 'dali', 'rembrandt', 'klimt',
  'mondrian', 'kandinsky', 'munch', 'okeeffe', 'kahlo', 'warhol',
  'hokusai', 'davinci', 'michelangelo', 'renoir', 'matisse', 'hopper',
  'rothko', 'basquiat'
];

export function ThemeControls({ theme, setTheme, painterStyle, setPainterStyle, language, setLanguage }: ThemeControlsProps) {
  return (
    <div className="flex items-center gap-4 bg-[var(--card-bg)] p-2 rounded-xl shadow-sm border border-[var(--border-color)]">
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        title="Toggle Dark Mode"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <button
        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-medium"
        title="Toggle Language"
      >
        <Globe size={20} />
        {language === 'en' ? 'EN' : '繁中'}
      </button>

      <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-4">
        <Palette size={20} className="text-[var(--secondary-color)]" />
        <select
          value={painterStyle}
          onChange={(e) => setPainterStyle(e.target.value)}
          className="bg-transparent border-none outline-none font-medium cursor-pointer capitalize"
        >
          {PAINTERS.map(p => (
            <option key={p} value={p} className="bg-[var(--bg-color)] text-[var(--text-color)]">
              {p.replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
