import React from 'react';

export function ProgressCard({ title, value, trend, children }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{trend}</span>
      </div>
      <p className="text-3xl font-black text-amber-700 dark:text-amber-300">{value}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
