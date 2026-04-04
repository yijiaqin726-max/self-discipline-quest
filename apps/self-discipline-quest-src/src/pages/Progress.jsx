import React from 'react';
import { Sidebar } from '../components/Sidebar';

const xpDays = [
  { label: '一', h: 60 },
  { label: '二', h: 45 },
  { label: '三', h: 85 },
  { label: '四', h: 55, active: true },
  { label: '五', h: 70 },
  { label: '六', h: 30 },
  { label: '日', h: 40 },
];

const executionDays = [
  { label: '一', h: 12 },
  { label: '二', h: 24 },
  { label: '三', h: 16 },
  { label: '四', h: 32, active: true },
  { label: '五', h: 28 },
  { label: '六', h: 8 },
  { label: '日', h: 4 },
];

const skills = [
  { name: '数学', sub: '应用逻辑', level: 8, pct: 85 },
  { name: '认知科学', sub: '记忆系统', level: 12, pct: 42 },
  { name: '研究方法', sub: '综合', level: 5, pct: 92 },
];

const milestones = [
  { level: 10, label: '流畅状态徽章', icon: 'verified', done: true },
  { level: 12, label: '夜猫子特权', icon: 'military_tech', done: true },
  { level: 14, label: '当前等级', icon: 'stars', current: true },
  { level: 15, label: '深度专注徽章', icon: 'lock', locked: true },
  { level: 20, label: '学术大师', icon: 'workspace_premium', locked: true },
];

const consistencyDots = Array.from({ length: 28 }, (_, i) => (i === 2 || i === 12 ? 'miss' : 'hit'));

export function Progress() {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <Sidebar />

      {/* Top Header */}
      <header className="sticky top-0 right-0 z-30 ml-64 flex items-center justify-between border-b border-gray-100 bg-white/80 px-8 py-3 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <h2 className="text-xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>进度洞察</h2>
          <nav className="hidden gap-6 md:flex">
            <a className="text-sm font-medium text-gray-500 transition-all hover:text-gray-900" href="#">任务</a>
            <a className="text-sm font-medium text-gray-500 transition-all hover:text-gray-900" href="#">专注</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative w-64">
            <input className="w-full rounded-full border-none bg-surface-container-low px-10 py-1.5 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search insights..." type="text" />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">search</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-surface-container-high px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-on-surface transition-all hover:bg-surface-container-highest">Pomodoro</button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary">
              <span className="text-[10px] font-black text-primary">14</span>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Bento Header Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Weekly XP Growth Chart */}
            <div className="col-span-12 rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(106,91,0,0.04)] lg:col-span-8">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Velocity Tracking</span>
                  <h3 className="text-2xl font-extrabold leading-none" style={{ letterSpacing: '-0.02em' }}>Weekly XP Growth</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary" style={{ letterSpacing: '-0.02em' }}>4,820</span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">+12% vs Last Week</span>
                </div>
              </div>
              {/* Chart */}
              <div className="relative flex h-64 items-end justify-between gap-4 px-2">
                {xpDays.map((d, i) => (
                  <div key={i} className="group flex flex-1 cursor-pointer flex-col items-center">
                    <div
                      className={`w-full rounded-t-lg transition-all ${d.active ? 'bg-primary-container shadow-sm' : 'bg-surface-container-high group-hover:bg-primary-container'}`}
                      style={{ height: `${d.h}%` }}
                    />
                    <span className={`mt-3 text-[10px] font-bold ${d.active ? 'font-black text-primary' : 'text-on-surface-variant'}`}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Sidebar */}
            <div className="col-span-12 space-y-6 lg:col-span-4">
              {/* Current Streak Card */}
              <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-on-primary">
                <div className="relative z-10">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest opacity-80">Active Momentum</span>
                  <h3 className="text-3xl font-black" style={{ letterSpacing: '-0.02em' }}>24 Day Streak</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="material-symbols-outlined filled-icon text-yellow-200">local_fire_department</span>
                    <span className="text-xs font-bold">Personal Record: 42 days</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                </div>
              </div>

              {/* Consistency Grid */}
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Consistency Grid</h4>
                  <span className="text-[10px] font-bold text-primary">Past 30 Days</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {consistencyDots.map((type, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${type === 'hit' ? 'bg-primary-container' : 'bg-surface-container'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Skills & Tasks */}
          <div className="grid grid-cols-12 gap-6">
            {/* Skill Progress Bars */}
            <div className="col-span-12 rounded-xl bg-surface-container-low p-6 md:col-span-4">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Core Competencies</h3>
              <div className="space-y-8">
                {skills.map((s, i) => (
                  <div key={i}>
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <h4 className="text-sm font-bold" style={{ letterSpacing: '-0.02em' }}>{s.name}</h4>
                        <span className="text-[10px] font-medium text-on-surface-variant">{s.sub}</span>
                      </div>
                      <span className="text-xs font-black text-primary">LVL {String(s.level).padStart(2, '0')}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="progress-gradient h-full shadow-[0_0_8px_rgba(106,91,0,0.2)]" style={{ width: `${s.pct}%` }} />
                    </div>
                    <div className="mt-1 text-right">
                      <span className="text-[9px] font-bold uppercase text-on-surface-variant">
                        {s.pct}% to level {String(s.level + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Trend */}
            <div className="col-span-12 rounded-xl bg-white p-6 shadow-sm md:col-span-5">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Execution Trend</h3>
              <div className="flex h-48 items-end gap-3 px-4">
                {executionDays.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center">
                    <div
                      className={`w-full rounded-t-sm ${d.active ? 'bg-primary' : 'bg-surface-container'}`}
                      style={{ height: `${d.h * 3}px` }}
                    />
                    <span className={`mt-2 text-[8px] font-bold ${d.active ? 'text-primary' : 'opacity-40'}`}>{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-around text-center">
                <div>
                  <span className="block text-lg font-black" style={{ letterSpacing: '-0.02em' }}>128</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Completed</span>
                </div>
                <div className="h-8 w-px bg-surface-container-highest" />
                <div>
                  <span className="block text-lg font-black" style={{ letterSpacing: '-0.02em' }}>14</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Avg / Day</span>
                </div>
              </div>
            </div>

            {/* Focus Hours Donut */}
            <div className="col-span-12 flex flex-col rounded-xl bg-white p-6 shadow-sm md:col-span-3">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-on-surface-variant">Focus Hours</h3>
              <div className="relative flex flex-1 items-center justify-center">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[12px] border-surface-container-highest">
                  <div className="absolute inset-0 mx-auto h-32 w-32 rotate-45 rounded-full border-[12px] border-primary border-l-transparent border-t-transparent" />
                  <div className="text-center">
                    <span className="text-xl font-black" style={{ letterSpacing: '-0.02em' }}>4.2</span>
                    <span className="block text-[8px] font-bold text-on-surface-variant">HRS / DAY</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium">Deep Work</span>
                  </div>
                  <span className="font-bold">65%</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-surface-container-highest" />
                    <span className="font-medium">Review</span>
                  </div>
                  <span className="font-bold">35%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unlock Timeline */}
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-10 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Unlock Timeline</h3>
              <button className="group flex items-center gap-1 text-xs font-bold text-primary">
                View All Achievements
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">chevron_right</span>
              </button>
            </div>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-surface-container-highest" />
              <div className="absolute left-0 top-1/2 h-[2px] w-[60%] -translate-y-1/2 bg-primary shadow-[0_0_10px_rgba(106,91,0,0.3)]" />
              {/* Milestones */}
              <div className="relative z-10 flex justify-between">
                {milestones.map((m, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {m.current ? (
                      <div className="relative -mt-2 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-primary-container text-primary shadow-xl ring-4 ring-primary/20">
                        <span className="material-symbols-outlined filled-icon text-2xl">{m.icon}</span>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-on-surface px-2 py-1 text-[8px] font-bold text-surface">YOU ARE HERE</div>
                      </div>
                    ) : m.done ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                        <span className="material-symbols-outlined filled-icon text-lg">{m.icon}</span>
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-container-highest text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg opacity-40">{m.icon}</span>
                      </div>
                    )}
                    <div className="mt-4 text-center">
                      <span className={`block text-[10px] font-black ${m.current ? 'text-primary' : m.locked ? 'opacity-40' : ''}`} style={{ letterSpacing: '-0.02em' }}>
                        Level {m.level}
                      </span>
                      <span className={`text-[9px] font-medium text-on-surface-variant ${m.locked ? 'opacity-60' : ''}`}>{m.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insight Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-4 rounded-xl bg-tertiary-container p-6 text-on-tertiary-container">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-on-tertiary-container text-tertiary-container">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div>
                <h4 className="mb-1 font-bold" style={{ letterSpacing: '-0.02em' }}>Optimal Focus Identified</h4>
                <p className="text-sm leading-relaxed opacity-80">
                  Your data shows you are most productive between <span className="font-black">8:30 AM and 10:45 AM</span>. We recommend scheduling "Mathematics" during this window to accelerate Level 09 unlocking.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-secondary-container p-6 text-on-secondary-container">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-on-secondary-container text-secondary-container">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <h4 className="mb-1 font-bold" style={{ letterSpacing: '-0.02em' }}>Momentum Rising</h4>
                <p className="text-sm leading-relaxed opacity-80">
                  You've completed <span className="font-black">12% more tasks</span> this week compared to last. Keep the streak going to unlock the Deep Focus Badge at Level 15.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
