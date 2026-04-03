import React from 'react';

export function StatsSection({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.key} className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700">
          <div className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">{stat.label}</div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{stat.value}</div>
          {stat.sub && <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.sub}</div>}
          {stat.progress !== undefined && (
            <div className="mt-3 w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div className={`h-full rounded-full ${stat.progress >= 100 ? 'bg-emerald-400' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, Math.max(0, stat.progress))}%` }} />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
