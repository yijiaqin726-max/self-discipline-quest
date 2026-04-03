import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TaskModal } from '../components/Modal';

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'break'
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, seconds]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (mode) => {
    setTimerMode(mode);
    setTimerRunning(false);
    setSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleSidebarChange = (key) => {
    if (key === 'add-task') setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar onChange={handleSidebarChange} />

      {/* Top Header */}
      <header className="sticky top-0 right-0 z-30 ml-64 flex items-center justify-between border-b border-gray-100 bg-white/70 px-10 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Focus Hub</h2>
          <div className="mx-2 h-4 w-[1px] bg-gray-200" />
          <div className="flex gap-4">
            <button className="text-sm font-semibold text-primary">Overview</button>
            <button className="text-sm font-medium text-gray-400 hover:text-gray-900">Analytics</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex w-72 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 transition-all focus-within:border-primary/50">
            <span className="material-symbols-outlined text-lg text-gray-400">search</span>
            <input className="ml-2 w-full border-none bg-transparent text-sm placeholder:text-gray-400 focus:ring-0" placeholder="Search tasks, docs..." type="text" />
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

      {/* Main Content */}
      <main className="ml-64 flex flex-col gap-10 p-10 xl:flex-row">
        {/* Left Section */}
        <section className="flex-1 space-y-10">
          <header className="flex items-end justify-between">
            <div>
              <h3 className="text-4xl font-extrabold tracking-tight text-gray-900">Today's Focus</h3>
              <p className="mt-2 flex items-center gap-2 font-medium text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                4/7 tasks completed • 320 XP to next level
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50">
                <span className="material-symbols-outlined">sort</span>
              </button>
            </div>
          </header>

          <div className="grid gap-4">
            {/* Active Task */}
            <div className="task-card-active group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-primary transition-colors group-hover:bg-primary/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold leading-tight text-gray-900">Research Thesis: Neural Plasticity</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="rounded-lg bg-yellow-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-yellow-700">In Progress</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                      <span className="material-symbols-outlined filled-icon text-sm">stars</span>
                      +250 XP
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <span className="material-symbols-outlined text-sm">flag</span>
                      High Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-1.5 font-mono text-sm font-semibold text-gray-600">25:00</div>
                <button className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10">
                  <span className="material-symbols-outlined filled-icon text-3xl">play_circle</span>
                </button>
              </div>
            </div>

            {/* Standard Task */}
            <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200">
              <div className="flex items-center gap-5">
                <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 transition-colors group-hover:border-primary" />
                <div>
                  <h4 className="text-lg font-bold leading-tight text-gray-900">Advanced Quantum Mechanics Problem Set</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">To-do</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                      <span className="material-symbols-outlined filled-icon text-sm">stars</span>
                      +150 XP
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      2:00 PM
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-gray-900">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            {/* Overdue Task */}
            <div className="group flex items-center justify-between rounded-2xl border border-red-50/50 border-l-4 border-l-red-400 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-red-200 transition-colors hover:border-red-400" />
                <div>
                  <h4 className="text-lg font-bold leading-tight text-gray-900">Submit Lab Report #4</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600">Overdue</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <span className="material-symbols-outlined filled-icon text-sm">warning</span>
                      +100 XP
                    </span>
                    <span className="text-xs font-medium text-red-400">Due Yesterday</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Task */}
            <div className="flex items-center justify-between rounded-2xl border border-transparent bg-gray-50/50 p-6 opacity-60">
              <div className="flex items-center gap-5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                  <span className="material-symbols-outlined text-base font-bold text-white">check</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold leading-tight text-gray-400 line-through">Review Analytical Chemistry Notes</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="rounded-lg bg-gray-200/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">Done</span>
                    <span className="text-xs font-bold text-gray-400">Awarded: 50 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 flex items-start justify-between">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Deep Focus Blocks</p>
                <span className="material-symbols-outlined text-primary/40 transition-colors group-hover:text-primary">hourglass_empty</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900">12</span>
                <span className="font-bold text-gray-400">hrs</span>
              </div>
              <div className="mt-8">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="progress-gradient h-full w-3/4 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                </div>
                <p className="mt-4 flex justify-between text-xs text-gray-400">
                  <span>Current goal: 16 hrs</span>
                  <span>75%</span>
                </p>
              </div>
            </div>
            <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 flex items-start justify-between">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Task Velocity</p>
                <span className="material-symbols-outlined text-green-500/40 transition-colors group-hover:text-green-500">trending_up</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900">94</span>
                <span className="font-bold text-gray-400">%</span>
              </div>
              <div className="mt-8 flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                5.2% from last week
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar Content */}
        <aside className="w-full space-y-6 xl:w-96">
          {/* Profile & Level Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="absolute -mr-20 -mt-20 right-0 top-0 h-40 w-40 rounded-full bg-primary/5" />
            <div className="relative">
              <div className="mb-8 flex items-center gap-6">
                <div className="relative">
                  <img className="h-20 w-20 rounded-2xl object-cover ring-4 ring-yellow-50" alt="Alex Thorne" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0g116qXD8RmAHwcD3U1b7DBfUwV8kn5gCDmZL5y_URBFrjMR-eCN3mElXZTCy1pJGw8ZP6zuNasVTIvM-qWVhJ8wNc7sWZtH-_kA1nl0j61U-7z3u7TYVGQFfy6xDIOslG06_bLpbF8VURLCyJSxmnoMWMBBCDqXuU4OglX5MBnzWRBvSz2_FVU6pHlYImQeiNxFc8_9jVGlltris9w5rGcfzjA7yTESKYUqluCxAVzr5kC_Vc6uGvqbekFnWGYhuBD2KBH_UdeE" />
                  <div className="absolute -bottom-2 -right-2 rounded-lg border border-gray-50 bg-white p-1 shadow-md">
                    <div className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase text-on-primary">Lv.14</div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900">Alex Thorne</h5>
                  <p className="text-sm font-medium text-gray-500">The Stoic Researcher</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  <span>XP Progress</span>
                  <span className="text-gray-900">4,680 / 5,000</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 p-0.5">
                  <div className="progress-gradient h-full w-[92%] rounded-full shadow-[0_0_12px_rgba(234,179,8,0.4)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Pomodoro Timer Widget */}
          <div className="flex flex-col items-center rounded-[2.5rem] bg-inverse-surface p-8 text-white shadow-xl shadow-gray-200">
            <p className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Focus Timer</p>
            <div className="mb-8 font-mono text-6xl font-black tracking-tighter">{formatTime(seconds)}</div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg shadow-white/10 transition-transform hover:scale-110"
              >
                <span className="material-symbols-outlined filled-icon text-3xl">{timerRunning ? 'pause' : 'play_arrow'}</span>
              </button>
              <button onClick={resetTimer} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
            <div className="mt-10 flex gap-4">
              <button
                onClick={() => switchMode('focus')}
                className={`rounded-xl px-5 py-2 text-[11px] font-bold ${timerMode === 'focus' ? 'bg-white/10 text-primary' : 'text-gray-400 hover:text-white'}`}
              >
                Focus
              </button>
              <button
                onClick={() => switchMode('break')}
                className={`rounded-xl px-5 py-2 text-[11px] font-bold ${timerMode === 'break' ? 'bg-white/10 text-primary' : 'text-gray-400 hover:text-white'} cursor-pointer transition-colors`}
              >
                Short Break
              </button>
            </div>
          </div>

          {/* Streak Widget */}
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h6 className="text-sm font-bold text-gray-900">Weekly Consistency</h6>
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined filled-icon text-2xl">local_fire_department</span>
                <span className="text-2xl font-black">14</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400">{d}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container text-primary">
                    <span className="material-symbols-outlined filled-icon text-lg">local_fire_department</span>
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400">S</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white ring-4 ring-yellow-100">
                  <span className="material-symbols-outlined filled-icon text-lg">local_fire_department</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 opacity-30">
                <span className="text-[10px] font-bold text-gray-400">S</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <span className="material-symbols-outlined text-lg">local_fire_department</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Level Unlock CTA */}
          <div className="flex cursor-pointer items-center gap-5 rounded-[2rem] bg-yellow-400 p-6 shadow-lg shadow-yellow-200 transition-all hover:scale-[1.02] hover:bg-yellow-500 active:scale-95">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <span className="material-symbols-outlined text-2xl text-on-primary">auto_awesome</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-on-primary/60">Next Unlock</p>
              <p className="font-bold text-on-primary">Zen Mode Visualization</p>
            </div>
            <span className="material-symbols-outlined text-on-primary">chevron_right</span>
          </div>
        </aside>
      </main>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
