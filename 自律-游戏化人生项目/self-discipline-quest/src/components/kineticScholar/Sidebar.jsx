import React from 'react';

const navItems = [
  { key: 'tasks', label: 'Tasks', icon: 'assignment' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar_month' },
  { key: 'progress', label: 'Progress', icon: 'equalizer' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export function Sidebar({ active = 'dashboard', onChange }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 p-4 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-r border-zinc-200">
      <div className="mb-8">
        <h1 className="text-lg font-black tracking-tight">The Kinetic Scholar</h1>
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Level 14 Focused</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const selected = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange?.(item.key)}
              className={`flex items-center gap-3 text-left rounded-lg px-4 py-2 transition ${
                selected
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-yellow-700 dark:text-yellow-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-xs tracking-widest uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        className="mt-4 w-full bg-yellow-500 text-white py-2 px-3 rounded-full font-bold hover:shadow-lg transition"
        onClick={() => onChange?.('add-task')}
      >
        <span className="material-symbols-outlined align-middle">add</span> Add Task
      </button>
      <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <button className="flex items-center gap-3 w-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 py-2">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-xs tracking-widest uppercase">Logout</span>
        </button>
      </div>
    </aside>
  );
}
