import React from 'react';

export function TimerWidget({ mode = 'pomodoro', minutes = 25, seconds = 0, onStart, onPause, onReset }) {
  const label = mode === 'pomodoro' ? 'Pomodoro' : 'Focus'
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{label}</p>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">Active</span>
      </div>
      <div className="text-4xl font-black text-zinc-900 dark:text-zinc-100 text-center mb-3">{time}</div>
      <div className="flex justify-center gap-2">
        <button onClick={onStart} className="px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-bold hover:bg-amber-600">Start</button>
        <button onClick={onPause} className="px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-sm font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600">Pause</button>
        <button onClick={onReset} className="px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-sm font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600">Reset</button>
      </div>
    </div>
  );
}
