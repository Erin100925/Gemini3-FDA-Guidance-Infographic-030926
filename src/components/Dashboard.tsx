import React, { useState } from 'react';
import { AppState } from '../types';
import { InfographicCard } from './InfographicCard';
import { CheckCircle2, HelpCircle, FileText, ArrowLeft, Download, ShieldAlert, Table, Mail } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
  onBack: () => void;
}

export function Dashboard({ state, onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'infographics' | 'checklist' | 'risk' | 'se_matrix' | 'fda_letter' | 'questions'>('infographics');

  const handleDownloadMarkdown = () => {
    let md = `# Regulatory Analysis Report\n\n`;
    
    md += `## Topics & Infographics\n\n`;
    state.topics.forEach(t => {
      md += `### ${t.id}. ${t.title}\n${t.summary}\n\n`;
      md += `**Takeaways:**\n${t.takeaways.map(x => `- ${x}`).join('\n')}\n\n`;
    });

    if (state.riskRadar) {
      md += `## Regulatory Risk Radar\n\n`;
      state.riskRadar.forEach(r => {
        md += `- **${r.category}** (Score: ${r.score}/10): ${r.reasoning}\n`;
      });
      md += `\n`;
    }

    if (state.seMatrix) {
      md += `## Substantial Equivalence Matrix\n\n`;
      md += `**Predicate Device:** ${state.seMatrix.predicateName}\n\n`;
      md += `| Feature | Subject Device | Predicate Device | Equivalence |\n`;
      md += `|---|---|---|---|\n`;
      state.seMatrix.comparisons.forEach(c => {
        md += `| ${c.feature} | ${c.subjectDevice} | ${c.predicateDevice} | ${c.equivalence} |\n`;
      });
      md += `\n`;
    }

    if (state.deficiencyLetter) {
      md += `## Simulated FDA Deficiency Letter\n\n`;
      md += `**Date:** ${state.deficiencyLetter.date}\n`;
      md += `**Reviewer:** ${state.deficiencyLetter.reviewerName}\n\n`;
      state.deficiencyLetter.deficiencies.forEach(d => {
        md += `### ${d.id}\n${d.description}\n\n**Requested Action:** ${d.requestedAction}\n\n`;
      });
    }

    md += `## Review Checklist\n\n${state.checklist.map(x => `- [ ] ${x}`).join('\n')}\n\n`;
    md += `## Follow-up Questions\n\n${state.questions.map((x, i) => `${i+1}. ${x}`).join('\n')}\n\n`;
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regulatory_analysis.md';
    a.click();
  };

  const handleDownloadHTML = () => {
    let html = `
      <html>
        <head>
          <title>Regulatory Analysis Report</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #111827; }
            h1, h2, h3 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
            th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
            th { background-color: #f9fafb; }
            .card { border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>Regulatory Analysis Report</h1>
          
          <h2>Topics & Infographics</h2>
          ${state.topics.map(t => `
            <div class="card">
              <h3>${t.id}. ${t.title}</h3>
              <p>${t.summary}</p>
              <h4>Takeaways:</h4>
              <ul>${t.takeaways.map(x => `<li>${x}</li>`).join('')}</ul>
            </div>
          `).join('')}
    `;

    if (state.riskRadar) {
      html += `<h2>Regulatory Risk Radar</h2><ul>`;
      state.riskRadar.forEach(r => {
        html += `<li><strong>${r.category}</strong> (Score: ${r.score}/10): ${r.reasoning}</li>`;
      });
      html += `</ul>`;
    }

    if (state.seMatrix) {
      html += `
        <h2>Substantial Equivalence Matrix</h2>
        <p><strong>Predicate Device:</strong> ${state.seMatrix.predicateName}</p>
        <table>
          <thead>
            <tr><th>Feature</th><th>Subject Device</th><th>Predicate Device</th><th>Equivalence</th></tr>
          </thead>
          <tbody>
            ${state.seMatrix.comparisons.map(c => `
              <tr><td>${c.feature}</td><td>${c.subjectDevice}</td><td>${c.predicateDevice}</td><td>${c.equivalence}</td></tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (state.deficiencyLetter) {
      html += `
        <h2>Simulated FDA Deficiency Letter</h2>
        <p><strong>Date:</strong> ${state.deficiencyLetter.date}<br>
        <strong>Reviewer:</strong> ${state.deficiencyLetter.reviewerName}</p>
        ${state.deficiencyLetter.deficiencies.map(d => `
          <div class="card">
            <h3>${d.id}</h3>
            <p>${d.description}</p>
            <p><strong>Requested Action:</strong> ${d.requestedAction}</p>
          </div>
        `).join('')}
      `;
    }

    html += `
          <h2>Review Checklist</h2>
          <ul>${state.checklist.map(x => `<li><input type="checkbox" disabled> ${x}</li>`).join('')}</ul>
          
          <h2>Follow-up Questions</h2>
          <ol>${state.questions.map(x => `<li>${x}</li>`).join('')}</ol>
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regulatory_analysis.html';
    a.click();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen pb-20 print:pb-0">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium shadow-sm"
        >
          <ArrowLeft size={20} /> Back to Editor
        </button>
        <h1 className="text-3xl font-bold font-sans text-center flex-1">
          {state.language === 'en' ? 'Regulatory Analysis Dashboard' : '法規分析儀表板'}
        </h1>
        <div className="flex gap-2">
          <button onClick={handleDownloadMarkdown} className="flex items-center gap-2 px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-black/5 transition-colors text-sm font-medium" title="Download Markdown">
            <Download size={16} /> MD
          </button>
          <button onClick={handleDownloadHTML} className="flex items-center gap-2 px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-black/5 transition-colors text-sm font-medium" title="Download HTML">
            <Download size={16} /> HTML
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-2 bg-[var(--primary-color)] text-white rounded-xl hover:opacity-90 transition-colors text-sm font-medium" title="Print / Save as PDF">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12 print:hidden">
        <TabButton active={activeTab === 'infographics'} onClick={() => setActiveTab('infographics')} icon={<FileText size={18} />} label="Infographics" count={state.topics.length} />
        <TabButton active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} icon={<CheckCircle2 size={18} />} label="Checklist" count={state.checklist.length} />
        <TabButton active={activeTab === 'risk'} onClick={() => setActiveTab('risk')} icon={<ShieldAlert size={18} />} label="Risk Radar" count={state.riskRadar?.length || 0} />
        <TabButton active={activeTab === 'se_matrix'} onClick={() => setActiveTab('se_matrix')} icon={<Table size={18} />} label="SE Matrix" count={state.seMatrix?.comparisons?.length || 0} />
        <TabButton active={activeTab === 'fda_letter'} onClick={() => setActiveTab('fda_letter')} icon={<Mail size={18} />} label="FDA Letter" count={state.deficiencyLetter?.deficiencies?.length || 0} />
        <TabButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} icon={<HelpCircle size={18} />} label="Questions" count={state.questions.length} />
      </div>

      <div className="print:block">
        {(activeTab === 'infographics' || document.body.classList.contains('printing')) && (
          <div className="print:mb-12">
            <h2 className="hidden print:block text-2xl font-bold mb-6">30 Infographics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {state.topics.map((topic) => (
                <InfographicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'checklist' || document.body.classList.contains('printing')) && (
          <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-4xl mx-auto w-full print:shadow-none print:border-none print:mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--primary-color)]">
              <CheckCircle2 size={28} />
              {state.language === 'en' ? 'Comprehensive Review Checklist' : '綜合審查清單'}
            </h2>
            <div className="space-y-4">
              {state.checklist.map((item, idx) => (
                <label key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-[var(--border-color)] print:p-2">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-transparent" />
                  <span className="text-lg leading-relaxed">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'risk' || document.body.classList.contains('printing')) && state.riskRadar && (
          <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-4xl mx-auto w-full print:shadow-none print:border-none print:mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-rose-500">
              <ShieldAlert size={28} />
              {state.language === 'en' ? 'Regulatory Risk Radar' : '法規風險雷達'}
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={state.riskRadar}>
                    <PolarGrid stroke="var(--border-color)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-color)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'var(--text-color)' }} />
                    <Radar name="Risk Score" dataKey="score" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                {state.riskRadar.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border-l-4" style={{ borderColor: item.score > 7 ? '#ef4444' : item.score > 4 ? '#f59e0b' : '#10b981' }}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{item.category}</span>
                      <span className="font-mono font-bold text-lg">{item.score}/10</span>
                    </div>
                    <p className="text-sm text-[var(--secondary-color)]">{item.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'se_matrix' || document.body.classList.contains('printing')) && state.seMatrix && (
          <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-5xl mx-auto w-full overflow-x-auto print:shadow-none print:border-none print:mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-indigo-500">
              <Table size={28} />
              {state.language === 'en' ? 'Substantial Equivalence Matrix' : '實質等同性矩陣'}
            </h2>
            <p className="mb-4 text-[var(--secondary-color)]">Predicate Device: <strong className="text-[var(--text-color)]">{state.seMatrix.predicateName}</strong></p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5">
                  <th className="p-4 border border-[var(--border-color)] font-bold">Feature</th>
                  <th className="p-4 border border-[var(--border-color)] font-bold">Subject Device</th>
                  <th className="p-4 border border-[var(--border-color)] font-bold">Predicate Device</th>
                  <th className="p-4 border border-[var(--border-color)] font-bold">Equivalence</th>
                </tr>
              </thead>
              <tbody>
                {state.seMatrix.comparisons.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 border border-[var(--border-color)] font-medium">{comp.feature}</td>
                    <td className="p-4 border border-[var(--border-color)] text-sm">{comp.subjectDevice}</td>
                    <td className="p-4 border border-[var(--border-color)] text-sm">{comp.predicateDevice}</td>
                    <td className="p-4 border border-[var(--border-color)]">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        comp.equivalence === 'Identical' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        comp.equivalence === 'Similar' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {comp.equivalence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'fda_letter' || document.body.classList.contains('printing')) && state.deficiencyLetter && (
          <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-4xl mx-auto w-full font-serif print:shadow-none print:border-none print:mb-12">
            <div className="flex justify-between items-start mb-8 border-b border-[var(--border-color)] pb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Simulated FDA Deficiency Letter</h2>
                <p className="text-slate-500 mt-2">Center for Devices and Radiological Health</p>
              </div>
              <div className="text-right text-slate-500">
                <p>Date: {state.deficiencyLetter.date}</p>
                <p>Reviewer: {state.deficiencyLetter.reviewerName}</p>
              </div>
            </div>
            
            <p className="mb-6 leading-relaxed">
              We have reviewed your submission and found that it lacks the information necessary to proceed with a substantive review. Please provide the following additional information:
            </p>

            <div className="space-y-8">
              {state.deficiencyLetter.deficiencies.map((def, idx) => (
                <div key={idx} className="pl-4 border-l-4 border-slate-300 dark:border-slate-600">
                  <h3 className="font-bold text-lg mb-2">{def.id}</h3>
                  <p className="mb-3 leading-relaxed">{def.description}</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <strong className="text-sm uppercase tracking-wider text-slate-500 block mb-1">Requested Action:</strong>
                    <p className="text-sm">{def.requestedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'questions' || document.body.classList.contains('printing')) && (
          <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] p-8 max-w-4xl mx-auto w-full print:shadow-none print:border-none">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--accent-color)]">
              <HelpCircle size={28} />
              {state.language === 'en' ? 'Follow-up Questions' : '後續問題'}
            </h2>
            <div className="space-y-6">
              {state.questions.map((question, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border-l-4 border-[var(--accent-color)] print:p-2 print:border-none print:bg-transparent">
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
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
        active 
          ? 'bg-[var(--primary-color)] text-white shadow-md' 
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
