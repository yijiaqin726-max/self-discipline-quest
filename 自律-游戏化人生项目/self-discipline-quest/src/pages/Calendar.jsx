import React from 'react';
import { Sidebar } from '../components/kineticScholar/Sidebar';
import { ProgressCard } from '../components/kineticScholar/ProgressCard';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar active="calendar" />
      <div className="ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-zinc-200">
          <h2 className="text-xl font-bold">Calendar Planner</h2>
          <button className="px-3 py-2 rounded-full bg-surface-container-high">Quick Add</button>
        </header>

        <main className="p-8 space-y-8">
          <section className="grid grid-cols-12 gap-6">
            <article className="col-span-12 lg:col-span-7 bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">October 2024</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-surface-container">←</button>
                  <button className="p-2 rounded-lg hover:bg-surface-container">→</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-zinc-100 rounded-xl overflow-hidden">
                {days.map((day) => (
                  <div key={day} className="bg-surface-container-low py-3 text-center text-[10px] font-bold uppercase text-zinc-400">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, index) => {
                  const isToday = index === 7;
                  return (
                    <div key={index} className={`h-28 p-2 border border-zinc-100 ${isToday ? 'bg-amber-200 ring ring-amber-300' : 'bg-surface-container-lowest'}`}>
                      <div className={`text-sm ${isToday ? 'font-bold text-amber-800' : 'text-zinc-700'}`}>{index + 1}</div>
                      {isToday && (
                        <div className="mt-2 space-y-1">
                          <div className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">Deep Work</div>
                          <div className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded">Review</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>

            <aside className="col-span-12 lg:col-span-5 space-y-4">
              <ProgressCard title="Weekly XP Forecast" value="1,200" trend="Full schedule" >
                <p className="text-sm text-zinc-500">Completing all scheduled sessions will net 1,200 XP.</p>
              </ProgressCard>
              <ProgressCard title="Consistency Grid" value="26/30" trend="87%" >
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} className={`aspect-square rounded-sm ${i % 2 ? 'bg-amber-400' : 'bg-surface-container'}`} />
                  ))}
                </div>
              </ProgressCard>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
