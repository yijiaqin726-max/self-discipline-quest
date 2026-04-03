import React from 'react';

export function TaskModal({ open, onClose, onCreate, initial = {} }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
          <div>
            <h2 className="text-2xl font-black">New Task Focus</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Design your next productivity sprint</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <main className="p-6 space-y-6">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Task Title</span>
            <input className="w-full mt-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" defaultValue={initial.title || ''} placeholder="What needs to be accomplished?" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Due Date</span>
              <input type="date" className="w-full mt-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" defaultValue={initial.due || ''} />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">XP Reward</span>
              <input type="number" min="0" className="w-full mt-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" defaultValue={initial.xp || 100} />
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Notes</span>
            <textarea className="w-full mt-1 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" rows={4} defaultValue={initial.notes || ''}></textarea>
          </label>
        </main>

        <footer className="flex justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-700">
          <button onClick={onClose} className="px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">Discard</button>
          <button
            onClick={onCreate}
            className="px-5 py-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 text-white font-black hover:opacity-95"
          >
            Create Task
          </button>
        </footer>
      </div>
    </div>
  );
}
