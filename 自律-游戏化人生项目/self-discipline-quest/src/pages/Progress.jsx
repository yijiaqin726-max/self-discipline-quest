import React from 'react';
import { Sidebar } from '../components/kineticScholar/Sidebar';
import { StatsSection } from '../components/kineticScholar/StatsSection';
import { ProgressCard } from '../components/kineticScholar/ProgressCard';

const statItems = [
  { key: 'xp', label: 'Total XP', value: '12,380', progress: 78 },
  { key: 'focus', label: 'Focus Hours', value: '72h', progress: 62 },
  { key: 'streak', label: 'Streak', value: '24 days', progress: 90 },
  { key: 'completion', label: 'Completion Rate', value: '83%', progress: 83 },
];

export function Progress() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar active="progress" />
      <div className="ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-zinc-200">
          <h2 className="text-xl font-bold">Progress & Analytics</h2>
          <div className="flex items-center gap-2 text-sm">  
            <button className="px-3 py-2 bg-surface-container-high rounded-full">Export</button>
            <button className="px-3 py-2 bg-surface-container-high rounded-full">Refresh</button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <StatsSection stats={statItems} />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ProgressCard title="Weekly XP Growth" value="4,820" trend="+12% vs last week">
              <div className="h-32 rounded-lg bg-surface-container flex items-center justify-center text-xs text-zinc-400">Placeholder chart area</div>
            </ProgressCard>
            <ProgressCard title="Consistency Grid" value="24/30" trend="80% " >
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className={`aspect-square rounded-sm ${i % 5 === 0 ? 'bg-surface-container' : 'bg-amber-400'}`} />
                ))}
              </div>
            </ProgressCard>
            <ProgressCard title="Skill Progress" value="85%" trend="+5%" >
              <div className="space-y-3">
                {['Math', 'Science', 'Writing'].map((skill) => (
                  <div key={skill}>
                    <div className="flex justify-between text-xs font-semibold"><span>{skill}</span><span>80%</span></div>
                    <div className="h-2 mt-1 w-full bg-zinc-200 rounded-full"><div className="h-full w-4/5 bg-amber-500 rounded-full" /></div>
                  </div>
                ))}
              </div>
            </ProgressCard>
          </section>
        </main>
      </div>
    </div>
  );
}
