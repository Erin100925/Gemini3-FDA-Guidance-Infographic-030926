import React from 'react';
import { Topic } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export function InfographicCard({ topic }: { topic: Topic }) {
  return (
    <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl border border-[var(--border-color)] overflow-hidden flex flex-col h-full transition-transform hover:-translate-y-1 duration-300">
      <div className="p-6 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-[var(--primary-color)] uppercase tracking-wider">
            Topic {topic.id}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--accent-color)] text-white">
            {topic.type.replace('_', ' ')}
          </span>
        </div>
        <h3 className="text-xl font-bold font-sans leading-tight mb-2">{topic.title}</h3>
        <p className="text-sm text-[var(--secondary-color)] leading-relaxed">{topic.summary}</p>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center min-h-[300px] relative">
        {renderChart(topic)}
      </div>

      <div className="p-6 bg-black/5 dark:bg-white/5 border-t border-[var(--border-color)]">
        <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-[var(--primary-color)]">Key Takeaways</h4>
        <ul className="space-y-2">
          {topic.takeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-[var(--accent-color)] mt-1">•</span>
              <span className="leading-relaxed">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function renderChart(topic: Topic) {
  const { type, data } = topic;

  if (!data || data.length === 0) {
    return <div className="text-center text-[var(--secondary-color)] italic">No data available for visualization.</div>;
  }

  switch (type) {
    case 'bar_chart':
      return (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="label" stroke="var(--text-color)" fontSize={12} />
            <YAxis stroke="var(--text-color)" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
              itemStyle={{ color: 'var(--primary-color)' }}
            />
            <Bar dataKey="value" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'pie_chart':
      return (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="label"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'timeline':
      return (
        <div className="relative border-l-2 border-[var(--primary-color)] ml-4 space-y-6">
          {data.map((item, idx) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--accent-color)] border-2 border-[var(--card-bg)]" />
              <div className="font-bold text-sm text-[var(--primary-color)]">{item.label}</div>
              <div className="text-sm mt-1">{item.description || item.value}</div>
            </div>
          ))}
        </div>
      );

    case 'checklist':
      return (
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5">
              <div className="mt-0.5 w-5 h-5 rounded border-2 border-[var(--primary-color)] flex-shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[var(--accent-color)] rounded-sm" />
              </div>
              <div>
                <div className="font-bold text-sm">{item.label}</div>
                {item.description && <div className="text-xs text-[var(--secondary-color)] mt-1">{item.description}</div>}
              </div>
            </div>
          ))}
        </div>
      );

    case 'comparison':
      return (
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5">
              <div className="font-bold text-[var(--primary-color)] mb-2 text-center border-b border-[var(--border-color)] pb-2">{item.label}</div>
              <div className="text-sm text-center">{item.value || item.description}</div>
            </div>
          ))}
        </div>
      );

    default:
      // Fallback for flowchart, swimlane, layered, myth_fact, etc.
      return (
        <div className="flex flex-wrap gap-3 justify-center">
          {data.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[var(--primary-color)] bg-black/5 dark:bg-white/5 max-w-[200px] text-center shadow-sm">
              <div className="font-bold text-sm text-[var(--primary-color)] mb-1">{item.label}</div>
              <div className="text-xs">{item.value || item.description}</div>
            </div>
          ))}
        </div>
      );
  }
}
