import React from 'react';
import { Sidebar } from '../components/Sidebar';

const DAYS_HEADER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calendarDays = [
  { day: 29, faded: true }, { day: 30, faded: true },
  { day: 1 }, { day: 2, dots: ['primary'] }, { day: 3 }, { day: 4 }, { day: 5 },
  { day: 6 },
  { day: 7, today: true, events: [{ label: 'Deep Work', color: 'bg-primary-container' }, { label: 'Review', color: 'bg-tertiary-container' }] },
  { day: 8 },
  { day: 9, events: [{ label: 'Deadline', color: 'bg-error-container/20 text-error' }] },
  { day: 10 }, { day: 11 }, { day: 12 },
  { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
];

export function Calendar() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />

      {/* Top Header */}
      <header className="sticky top-0 right-0 z-30 ml-64 flex items-center justify-between border-b border-gray-100 bg-white/70 px-10 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Scholar Schedule</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex w-64 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 transition-all focus-within:border-primary/50">
            <span className="material-symbols-outlined text-lg text-gray-400">search</span>
            <input className="ml-2 w-full border-none bg-transparent text-sm placeholder:text-gray-400 focus:ring-0" placeholder="Search tasks..." type="text" />
          </div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            <button className="relative text-gray-500 hover:text-gray-900">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>
            <img className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" alt="user avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkZi7qTk4y3vJq4sslJNS8XwJaViy1HEnkH8hb5zDSmXz4uW0f0fE_rNYQXPuI9XfozD1SbzdpcjiWiO6cVFiWh1rRooJrZYjBgPB4Ryljw7fjxJwXlgl9N4L71EVQtvflvRQw4nEIu1GsJEWTxnEzhH0wvWVZLz9-1Q-aI3YwN9LTlMt9qSExRht42nSxrkO5o2XahnXE3F3DHPgMDvK5ua_i8Z8cVIhytfbNA7OSKHXshP2Pnv4NsiWKshcAfCJMwOYwF-nq92I" />
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-[1400px]">
          {/* Page Header */}
          <header className="mb-10 flex items-end justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Productivity Hub</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <span className="text-xs font-medium text-gray-500">October 2024</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Scholar Schedule</h1>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 font-bold text-on-primary-container shadow-lg shadow-yellow-500/10 transition-all hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined">add</span>
              <span>Quick Add Task</span>
            </button>
          </header>

          <div className="grid grid-cols-12 items-start gap-8">
            {/* Left Column: Calendar Grid */}
            <section className="col-span-12 space-y-6 lg:col-span-7">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">October 2024</h2>
                  <div className="flex gap-2">
                    <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                  {/* Day Headers */}
                  {DAYS_HEADER.map((d) => (
                    <div key={d} className="bg-surface-container-low py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {d}
                    </div>
                  ))}
                  {/* Calendar Days */}
                  {calendarDays.map((cell, i) => (
                    <div
                      key={i}
                      className={`h-28 bg-white p-2 ${cell.faded ? 'text-gray-300' : 'font-semibold'} ${
                        cell.today ? 'bg-primary-container/10 font-bold ring-2 ring-inset ring-primary relative' : ''
                      }`}
                    >
                      {cell.day}
                      {cell.dots && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cell.dots.map((c, j) => (
                            <span key={j} className={`h-1.5 w-1.5 rounded-full bg-${c}`} />
                          ))}
                        </div>
                      )}
                      {cell.events && (
                        <div className="mt-2 space-y-1">
                          {cell.events.map((ev, j) => (
                            <div key={j} className={`truncate rounded px-1.5 py-0.5 text-[10px] font-bold leading-tight ${ev.color}`}>
                              {ev.label}
                            </div>
                          ))}
                        </div>
                      )}
                      {cell.today && <span className="absolute bottom-2 right-2 text-[10px] text-primary">TODAY</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* XP Forecast Card */}
              <div className="flex items-center justify-between rounded-3xl bg-surface-container-low p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container">
                    <span className="material-symbols-outlined filled-icon text-secondary">stars</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Weekly XP Forecast</h4>
                    <p className="text-sm text-gray-500">Completing all scheduled sessions will net 1,200 XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black italic text-primary">+1.2k</span>
                </div>
              </div>
            </section>

            {/* Right Column: Daily Schedule */}
            <section className="col-span-12 space-y-6 lg:col-span-5">
              <div className="min-h-[700px] rounded-3xl bg-white p-8 shadow-lg shadow-gray-900/5">
                <div className="mb-8 flex items-baseline justify-between">
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">October 7</h2>
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Monday</span>
                </div>

                {/* Timeline */}
                <div className="relative space-y-8 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:bg-gray-100">
                  {/* Focus Session */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white bg-primary" />
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">09:00 — 10:30</p>
                        <h3 className="text-lg font-bold text-gray-900">Deep Work: Thesis Research</h3>
                      </div>
                      <span className="rounded-full bg-primary-container px-3 py-1 text-[10px] font-bold text-on-primary-container">+450 XP</span>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        <span>Focus Mode: Enabled</span>
                        <span className="mx-1">•</span>
                        <span>No Notifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 rounded-xl bg-gray-900 py-2 text-xs font-bold text-white transition-colors hover:bg-black">START SESSION</button>
                        <button className="rounded-xl border border-gray-200 p-2 transition-colors hover:bg-white">
                          <span className="material-symbols-outlined text-sm">more_horiz</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Task Item */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white bg-gray-200" />
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">11:00 — 11:45</p>
                      <span className="text-[10px] font-bold text-gray-500">Task</span>
                    </div>
                    <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 transition-colors hover:border-primary/30">
                      <div className="flex items-center gap-4">
                        <button className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-gray-300 transition-colors group-hover:border-primary" />
                        <div>
                          <p className="font-bold text-gray-800">Email professor regarding edits</p>
                          <p className="text-[10px] text-gray-400">Personal Momentum</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400">+50 XP</span>
                    </div>
                  </div>

                  {/* Active Recall Session */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white bg-tertiary" />
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">13:00 — 14:30</p>
                        <h3 className="text-lg font-bold text-gray-900">Active Recall Session</h3>
                      </div>
                      <span className="rounded-full bg-tertiary-container px-3 py-1 text-[10px] font-bold text-on-tertiary-container">+300 XP</span>
                    </div>
                    <div className="rounded-2xl border border-tertiary/10 bg-tertiary-container/5 p-4">
                      <p className="mb-2 text-xs text-gray-600">Topics: Applied Mathematics, Neural Networks</p>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-1/3 bg-tertiary" />
                      </div>
                    </div>
                  </div>

                  {/* Deadline Task */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white bg-error" />
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-error">EOD DEADLINE</p>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-error/10 bg-error-container/5 p-4">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-error">priority_high</span>
                        <div>
                          <p className="font-bold text-gray-900">Project Proposal Submission</p>
                          <p className="text-[10px] font-bold text-error">CRITICAL</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-error">+1000 XP</span>
                    </div>
                  </div>
                </div>

                {/* Daily Progress Summary */}
                <div className="mt-12 border-t border-gray-100 pt-8">
                  <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">Daily Focus Pulse</h4>
                  <div className="flex h-16 items-end gap-1.5">
                    {[30, 80, 10, 40, 90, 60, 20, 50, 75, 35].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-primary" style={{ height: `${h}%`, opacity: h < 40 ? 0.2 : h < 60 ? h / 100 : 1 }} />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[8px] font-bold uppercase tracking-tighter text-gray-400">
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
