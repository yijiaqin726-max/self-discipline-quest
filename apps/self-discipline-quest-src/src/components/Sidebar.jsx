import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { key: 'dashboard', label: '总览', icon: 'dashboard', path: '/dashboard' },
  { key: 'tasks', label: '任务', icon: 'assignment', path: '/tasks' },
  { key: 'calendar', label: '日历', icon: 'calendar_today', path: '/calendar' },
  { key: 'progress', label: '进度', icon: 'equalizer', path: '/progress' },
  { key: 'settings', label: '设置', icon: 'settings', path: '/settings' },
];

export function Sidebar({ active = 'dashboard', onChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = navItems.find((item) => item.path && location.pathname.startsWith(item.path))?.key || active;

  const handleNavClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
    onChange?.(item.key);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-gray-100 bg-white p-4">
      <div className="mb-8 px-4">
        <h1 className="text-lg font-black tracking-tight text-zinc-900">自律学者</h1>
        <div className="mt-2 flex items-center gap-2">
          <img
            className="h-8 w-8 rounded-full border-2 border-primary-container object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkZi7qTk4y3vJq4sslJNS8XwJaViy1HEnkH8hb5zDSmXz4uW0f0fE_rNYQXPuI9XfozD1SbzdpcjiWiO6cVFiWh1rRooJrZYjBgPB4Ryljw7fjxJwXlgl9N4L71EVQtvflvRQw4nEIu1GsJEWTxnEzhH0wvWVZLz9-1Q-aI3YwN9LTlMt9qSExRht42nSxrkO5o2XahnXE3F3DHPgMDvK5ua_i8Z8cVIhytfbNA7OSKHXshP2Pnv4NsiWKshcAfCJMwOYwF-nq92I"
            alt="用户头像"
          />
          <div>
            <p className="text-xs font-bold text-on-surface">等级 14 · 专注中</p>
            <p className="text-[10px] font-medium text-on-surface-variant">秦逸嘉</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const selected = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition ${
                selected
                  ? 'bg-zinc-200 font-bold text-yellow-700'
                  : 'text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-xs uppercase tracking-[0.05em]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-4 py-3 font-bold text-on-primary-container transition-all hover:shadow-lg hover:scale-[1.02]"
        onClick={() => onChange?.('add-task')}
      >
        <span className="material-symbols-outlined">add</span>
        添加任务
      </button>

      <div className="mt-auto border-t border-zinc-200 pt-4">
        <button className="flex w-full items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-900">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-xs uppercase tracking-[0.05em]">退出登录</span>
        </button>
      </div>
    </aside>
  );
}
