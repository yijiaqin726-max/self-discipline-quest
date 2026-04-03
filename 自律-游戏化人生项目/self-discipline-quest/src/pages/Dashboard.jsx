import React, { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TaskCard } from '../components/TaskCard';
import { TimerWidget } from '../components/Timer';
import { ProgressCard } from '../components/ProgressCard';
import { StatsSection } from '../components/StatsSection';
import { TaskModal } from '../components/Modal';

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

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(sampleTasks);
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0, running: false });
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('streak') || 24));
  const [lastActiveDay, setLastActiveDay] = useState(() => localStorage.getItem('lastActiveDay') || new Date().toISOString().split('T')[0]);

  const totalXP = useMemo(() => tasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.xp, 0), [tasks]);
  const xpPerLevel = 500;
  const level = Math.max(1, Math.floor(totalXP / xpPerLevel) + 1);
  const xpInLevel = totalXP % xpPerLevel;
  const xpToNextLevel = xpPerLevel - xpInLevel;

  const progressStreak = `${streak} Day${streak === 1 ? '' : 's'}`;

  const statItemsCurrent = [
    { key: 'level', label: 'Current Level', value: `Lv ${level}` },
    { key: 'xp', label: 'XP Progress', value: `${xpInLevel}/${xpPerLevel}`, progress: (xpInLevel / xpPerLevel) * 100 },
    { key: 'streak', label: 'Daily Streak', value: progressStreak, progress: Math.min(100, (streak / 30) * 100) },
    { key: 'tasks', label: 'Completed Tasks', value: `${tasks.filter((t) => t.status === 'done').length}`, progress: (tasks.filter((t) => t.status === 'done').length / Math.max(1, tasks.length)) * 100 },
  ];

  const handleCreateTask = () => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: 'New task', status: 'todo', xp: 120 },
    ]);
    setIsModalOpen(false);
  };

  const handleCompleteTask = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.status !== 'done'
          ? { ...task, status: 'done' }
          : task
      )
    );

    if (lastActiveDay !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const nextStreak = lastActiveDay === yesterday ? streak + 1 : 1;
      setStreak(nextStreak);
      setLastActiveDay(today);
      localStorage.setItem('streak', String(nextStreak));
      localStorage.setItem('lastActiveDay', today);
    }
  };

  React.useEffect(() => {
    if (!timer.running) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59, running: true };
        }
        return { ...prev, running: false };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.running]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar active="tasks" onChange={(key) => key === 'add-task' && setIsModalOpen(true)} />
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
          <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-500 font-bold">Scholar Dashboard</p>
                <h3 className="text-2xl font-extrabold">Welcome back, Alex</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">来自 stitch 的视觉和数据展示，实时更新你的任务与进度。</p>
              </div>
              <img
                className="w-20 h-20 rounded-full border-4 border-amber-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkZi7qTk4y3vJq4sslJNS8XwJaViy1HEnkH8hb5zDSmXz4uW0f0fE_rNYQXPuI9XfozD1SbzdpcjiWiO6cVFiWh1rRooJrZYjBgPB4Ryljw7fjxJwXlgl9N4L71EVQtvflvRQw4nEIu1GsJEWTxnEzhH0wvWVZLz9-1Q-aI3YwN9LTlMt9qSExRht42nSxrkO5o2XahnXE3F3DHPgMDvK5ua_i8Z8cVIhytfbNA7OSKHXshP2Pnv4NsiWKshcAfCJMwOYwF-nq92I"
                alt="Alex Avatar"
              />
            </div>
          </section>
          <section>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-black">Today's Focus</h3>
                <p className="text-zinc-600 dark:text-zinc-300">Level {level} • {totalXP} XP earned • {xpToNextLevel} XP to Level {level + 1}</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="rounded-full bg-amber-500 text-white px-4 py-2 font-bold">New Task</button>
            </div>
          </section>

          <StatsSection stats={statItemsCurrent} />

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onPlay={() => console.log('play', task.id)}
                  onMore={() => console.log('more', task.id)}
                  onComplete={() => handleCompleteTask(task.id)}
                />
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
