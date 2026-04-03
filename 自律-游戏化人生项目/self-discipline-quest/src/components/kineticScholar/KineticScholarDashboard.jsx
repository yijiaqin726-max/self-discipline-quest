import React, { useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TaskCard } from './TaskCard';
import { TimerWidget } from './TimerWidget';
import { ProgressCard } from './ProgressCard';
import { StatsSection } from './StatsSection';
import { TaskModal } from './TaskModal';

const sampleTasks = [
  { id: 1, title: 'Advanced Quantum Mechanics Problem Set', status: 'todo', xp: 150, due: '2:00 PM' },
  { id: 2, title: 'Research Thesis: Neural Plasticity', status: 'inprogress', xp: 250, priority: 'High', due: '4:30 PM' },
  { id: 3, title: 'Review Analytical Chemistry Notes', status: 'done', xp: 50 },
  { id: 4, title: 'Submit Lab Report #4', status: 'overdue', xp: 100, due: 'Yesterday' },
];

const statItems = [
  { key: 'focus', label: 'Deep Focus Blocks', value: '12 hrs', progress: 80 },
  { key: 'xp', label: 'XP Earned', value: '4,820', progress: 62 },
  { key: 'streak', label: 'Current Streak', value: '24 Days', progress: 90 },
  { key: 'tasks', label: 'Tasks Completed', value: '46%', progress: 46 },
];

export function KineticScholarDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(sampleTasks);
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0, running: false });

  const nextLevel = useMemo(() => 320, []);

  const handleCreateTask = () => {
    // Mock create behavior for sample
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: 'New task', status: 'todo', xp: 120 },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">      
      <Sidebar active="dashboard" onChange={(key) => { if (key === 'add-task') setIsModalOpen(true); }} />
      <div className="ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-zinc-200">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full gap-2">
              <span className="material-symbols-outlined">search</span>
              <input className="bg-transparent border-none focus:outline-none" placeholder="Search focus blocks..." />
            </div>
            <button className="px-3 py-2 bg-surface-container-high rounded-full text-sm font-medium">Pomodoro</button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <section>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-black">Today's Focus</h3>
                <p className="text-zinc-600 dark:text-zinc-300">You've completed 4/7 tasks. {nextLevel} XP away from Level 15.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="rounded-full bg-amber-500 text-white px-4 py-2 font-bold">Quick Add Task</button>
            </div>
          </section>

          <StatsSection stats={statItems} />

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} {...task} onPlay={() => console.log('play', task.id)} onMore={() => console.log('more', task.id)} />
              ))}
            </div>
            <div className="space-y-4">
              <ProgressCard title="Weekly XP Growth" value="4,820" trend="+12% vs last week">
                <div className="h-40 border border-dashed border-zinc-300 rounded-xl flex items-center justify-center text-zinc-400">Chart placeholder</div>
              </ProgressCard>
              <TimerWidget
                minutes={timer.minutes}
                seconds={timer.seconds}
                onStart={() => setTimer((t) => ({ ...t, running: true }))}
                onPause={() => setTimer((t) => ({ ...t, running: false }))}
                onReset={() => setTimer({ minutes: 25, seconds: 0, running: false })}
              />
            </div>
          </section>
        </main>
      </div>

      <TaskModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateTask} />
    </div>
  );
}
