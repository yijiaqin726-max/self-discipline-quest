import React from 'react';

const statusStyles = {
  todo: 'bg-yellow-300 text-yellow-900',
  inprogress: 'bg-amber-300 text-amber-900',
  done: 'bg-slate-200 text-slate-600',
  overdue: 'bg-red-200 text-red-800',
};

export function TaskCard({ title, status = 'todo', xp = 0, due, priority, onPlay, onMore, onComplete }) {
  const statusLabel = {
    todo: 'To-do',
    inprogress: 'In Progress',
    done: 'Done',
    overdue: 'Overdue',
  }[status];

  return (
    <article
      onClick={onComplete}
      className={`cursor-pointer bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition ${status === 'done' ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className={`font-semibold text-lg ${status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-zinc-50'}`}>{title}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${statusStyles[status]}`}>{statusLabel}</span>
            <span className="text-yellow-700 font-bold">+{xp} XP</span>
            {priority && (
              <span className="text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">priority_high</span>
                {priority}
              </span>
            )}
            {due && (
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {due}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={onPlay} className="p-2 text-yellow-600 hover:text-yellow-800 rounded-full">
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
          <button onClick={onMore} className="p-2 text-zinc-500 hover:text-zinc-900 rounded-full">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
    </article>
  );
}
