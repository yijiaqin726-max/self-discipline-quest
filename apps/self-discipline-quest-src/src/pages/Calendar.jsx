import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TaskModal } from '../components/Modal';

const DAYS_HEADER = ['日', '一', '二', '三', '四', '五', '六'];

const calendarDays = [
  { day: 29, faded: true }, { day: 30, faded: true },
  { day: 1 }, { day: 2, dots: ['primary'] }, { day: 3 }, { day: 4 }, { day: 5 },
  { day: 6 },
  { day: 7, today: true, events: [{ label: '深度专注', color: 'bg-primary-container' }, { label: '复盘回顾', color: 'bg-tertiary-container' }] },
  { day: 8 },
  { day: 9, events: [{ label: '截止日', color: 'bg-error-container/20 text-error' }] },
  { day: 10 }, { day: 11 }, { day: 12 },
  { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
];

export function Calendar() {
  const monthOptions = ['2024 年 10 月', '2024 年 11 月', '2024 年 12 月'];
  const [monthIndex, setMonthIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [focusMode, setFocusMode] = useState('免打扰');
  const [noticeCount, setNoticeCount] = useState(1);
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 1,
      time: '11:00 — 11:45',
      title: '给导师发送修改说明邮件',
      subtitle: '个人推进',
      xp: 50,
      done: false,
      kind: 'task',
    },
    {
      id: 2,
      time: '当日截止',
      title: '项目提案提交',
      subtitle: '高优先级',
      xp: 1000,
      done: false,
      kind: 'deadline',
    },
  ]);

  const toggleTask = (id) => {
    setDailyTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (id) => {
    setDailyTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const prevMonth = () => {
    setMonthIndex((prev) => (prev - 1 + monthOptions.length) % monthOptions.length);
  };

  const nextMonth = () => {
    setMonthIndex((prev) => (prev + 1) % monthOptions.length);
  };

  const handleCreateTask = () => {
    setDailyTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: '19:30 — 20:00',
        title: '新建任务（可编辑）',
        subtitle: '快速添加',
        xp: 80,
        done: false,
        kind: 'task',
      },
    ]);
    setModalOpen(false);
  };

  const handleSidebarChange = (key) => {
    if (key === 'add-task') {
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar active="calendar" onChange={handleSidebarChange} />

      {/* Top Header */}
      <header className="sticky top-0 right-0 z-30 ml-64 flex items-center justify-between border-b border-gray-100 bg-white/70 px-10 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">学者日程</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex w-64 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 transition-all focus-within:border-primary/50">
            <span className="material-symbols-outlined text-lg text-gray-400">search</span>
            <input className="ml-2 w-full border-none bg-transparent text-sm placeholder:text-gray-400 focus:ring-0" placeholder="搜索任务..." type="text" />
          </div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            <button
              onClick={() => setNoticeCount(0)}
              className="relative text-gray-500 hover:text-gray-900"
              title="清空提醒"
            >
              <span className="material-symbols-outlined">notifications</span>
              {noticeCount > 0 && <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500" />}
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
                <span className="text-xs font-bold uppercase tracking-widest text-primary">效率中枢</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <span className="text-xs font-medium text-gray-500">2024 年 10 月</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">学者计划日历</h1>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 font-bold text-on-primary-container shadow-lg shadow-yellow-500/10 transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span>快速添加任务</span>
            </button>
          </header>

          <div className="grid grid-cols-12 items-start gap-8">
            {/* Left Column: Calendar Grid */}
            <section className="col-span-12 space-y-6 lg:col-span-7">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{monthOptions[monthIndex]}</h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="rounded-lg p-2 transition-colors hover:bg-gray-100" title="上个月">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={nextMonth} className="rounded-lg p-2 transition-colors hover:bg-gray-100" title="下个月">
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
                      {cell.today && <span className="absolute bottom-2 right-2 text-[10px] text-primary">今天</span>}
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
                    <h4 className="font-bold text-gray-900">本周经验值预测</h4>
                    <p className="text-sm text-gray-500">按计划完成所有专注时段可获得 1,200 XP</p>
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
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">10 月 7 日</h2>
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-400">周一</span>
                </div>

                {/* Timeline */}
                <div className="relative space-y-8 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:bg-gray-100">
                  {/* Focus Session */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white bg-primary" />
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">09:00 — 10:30</p>
                        <h3 className="text-lg font-bold text-gray-900">深度专注：论文研究</h3>
                      </div>
                      <span className="rounded-full bg-primary-container px-3 py-1 text-[10px] font-bold text-on-primary-container">+450 XP</span>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        <span>{`专注模式：${sessionRunning ? '进行中' : '待开始'}`}</span>
                        <span className="mx-1">•</span>
                        <span>{focusMode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSessionRunning((v) => !v)}
                          className="flex-1 rounded-xl bg-gray-900 py-2 text-xs font-bold text-white transition-colors hover:bg-black"
                        >
                          {sessionRunning ? '暂停专注' : '开始专注'}
                        </button>
                        <button
                          onClick={() => setFocusMode((v) => (v === '免打扰' ? '标准提醒' : '免打扰'))}
                          className="rounded-xl border border-gray-200 p-2 transition-colors hover:bg-white"
                          title="切换专注模式"
                        >
                          <span className="material-symbols-outlined text-sm">more_horiz</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {dailyTasks.map((task) => (
                    <div key={task.id} className="relative pl-10">
                      <div
                        className={`absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white ${
                          task.kind === 'deadline' ? 'bg-error' : task.done ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                      <div className="mb-1 flex items-center justify-between">
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            task.kind === 'deadline' ? 'text-error' : 'text-gray-400'
                          }`}
                        >
                          {task.time}
                        </p>
                        <span className="text-[10px] font-bold text-gray-500">任务</span>
                      </div>

                      <div
                        className={`group flex items-center justify-between rounded-2xl border p-4 transition-colors ${
                          task.kind === 'deadline'
                            ? 'border-error/10 bg-error-container/5'
                            : 'border-gray-100 bg-white hover:border-primary/30'
                        } ${task.done ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors ${
                              task.done ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 group-hover:border-primary'
                            }`}
                            title={task.done ? '取消完成' : '标记完成'}
                          >
                            {task.done && <span className="material-symbols-outlined text-sm">check</span>}
                          </button>
                          <div>
                            <p className={`font-bold ${task.done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                            <p className={`text-[10px] ${task.kind === 'deadline' ? 'font-bold text-error' : 'text-gray-400'}`}>{task.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black ${task.kind === 'deadline' ? 'text-error' : 'text-gray-400'}`}>+{task.xp} XP</span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            title="删除任务"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {dailyTasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-center text-xs font-semibold text-gray-400">
                      今日任务已清空，可在上方快速添加。
                    </div>
                  )}

                  {/* Active Recall Session */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 z-10 h-6 w-6 rounded-full border-4 border-white bg-tertiary" />
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">13:00 — 14:30</p>
                        <h3 className="text-lg font-bold text-gray-900">主动回忆训练</h3>
                      </div>
                      <span className="rounded-full bg-tertiary-container px-3 py-1 text-[10px] font-bold text-on-tertiary-container">+300 XP</span>
                    </div>
                    <div className="rounded-2xl border border-tertiary/10 bg-tertiary-container/5 p-4">
                      <p className="mb-2 text-xs text-gray-600">主题：应用数学、神经网络</p>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-1/3 bg-tertiary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Progress Summary */}
                <div className="mt-12 border-t border-gray-100 pt-8">
                  <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">今日专注脉冲</h4>
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

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateTask} />
    </div>
  );
}
