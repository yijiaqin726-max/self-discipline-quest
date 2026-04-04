import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TaskModal } from '../components/Modal';
import { StatusTag, PriorityTag, XPBadge, EmptyState, TaskCardCompact } from '../components/common';
import { useAppStore, AppActions } from '../stores/appStore';

export function Tasks() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const store = useAppStore();
  const [tasks, setTasks] = useState([]);

  // 订阅状态变化
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setTasks(state.tasks);
    });
    setTasks(store.getState().tasks);
    return unsubscribe;
  }, []);

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return statusMatch && searchMatch;
  });

  // 统计
  const stats = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
    overdue: tasks.filter((t) => t.status === 'overdue').length,
  };

  const statusOptions = [
    { key: 'all', label: '全部', count: stats.all },
    { key: 'todo', label: '待办', count: stats.todo },
    { key: 'in-progress', label: '进行中', count: stats['in-progress'] },
    { key: 'done', label: '已完成', count: stats.done },
    { key: 'overdue', label: '已逾期', count: stats.overdue },
  ];

  const handleTaskToggle = (id) => {
    AppActions.toggleTaskDone(id);
  };

  const handleTaskDelete = (id) => {
    AppActions.deleteTask(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Top Header */}
      <header className="sticky top-0 right-0 z-30 ml-64 flex items-center justify-between border-b border-gray-100 bg-white/70 px-10 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">任务列表</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex w-72 items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 transition-all focus-within:border-primary/50">
            <span className="material-symbols-outlined text-lg text-gray-400">search</span>
            <input 
              className="ml-2 w-full border-none bg-transparent text-sm placeholder:text-gray-400 focus:ring-0"
              placeholder="搜索任务..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span>
            <span>新增任务</span>
          </button>
        </div>
      </header>

      <main className="ml-64 p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">全部任务</h1>
            <p className="mt-2 text-sm text-gray-600">在这里查看、管理、和追踪你的所有任务</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            {statusOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterStatus(opt.key)}
                className={`rounded-2xl border-2 px-4 py-4 text-center transition-all ${
                  filterStatus === opt.key
                    ? 'border-primary bg-primary/5 font-bold text-primary'
                    : 'border-gray-100 bg-white font-semibold text-gray-600 hover:border-gray-200'
                }`}
              >
                <div className="text-2xl font-black">{opt.count}</div>
                <div className="mt-1 text-xs">{opt.label}</div>
              </button>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {statusOptions.slice(1).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterStatus(opt.key)}
                className={`border-b-2 px-4 py-3 transition-colors ${
                  filterStatus === opt.key
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent font-medium text-gray-500 hover:text-gray-900'
                }`}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>

          {/* Tasks List */}
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCardCompact
                  key={task.id}
                  task={task}
                  onToggle={handleTaskToggle}
                  onDelete={handleTaskDelete}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-12">
              <EmptyState
                icon="task_alt"
                title="暂无任务"
                subtitle={searchQuery ? '搜索结果为空，试试其他关键词' : '没有该状态的任务，开始创建新任务吧'}
              />
            </div>
          )}

          {/* Task Summary */}
          {tasks.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">完成率</p>
                  <p className="mt-2 text-2xl font-black text-gray-900">
                    {Math.round((stats.done / stats.all) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">总获得 XP</p>
                  <p className="mt-2 text-2xl font-black text-primary">
                    {tasks.reduce((sum, t) => sum + (t.status === 'done' ? t.xp : 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">待完成</p>
                  <p className="mt-2 text-2xl font-black text-gray-900">
                    {stats.todo + stats['in-progress']}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

