import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { key: 'tasks', label: 'Tasks', icon: 'assignment' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar_today', path: '/calendar' },
  { key: 'progress', label: 'Progress', icon: 'bar_chart', path: '/progress' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
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
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-gray-100 bg-white p-6 text-zinc-800">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-lg font-bold">bolt</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">Kinetic Scholar</h1>
        </div>
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full border-2 border-yellow-300"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkZi7qTk4y3vJq4sslJNS8XwJaViy1HEnkH8hb5zDSmXz4uW0f0fE_rNYQXPuI9XfozD1SbzdpcjiWiO6cVFiWh1rRooJrZYjBgPB4Ryljw7fjxJwXlgl9N4L71EVQtvflvRQw4nEIu1GsJEWTxnEzhH0wvWVZLz9-1Q-aI3YwN9LTlMt9qSExRht42nSxrkO5o2XahnXE3F3DHPgMDvK5ua_i8Z8cVIhytfbNA7OSKHXshP2Pnv4NsiWKshcAfCJMwOYwF-nq92I"
            alt="Scholar Avatar"
          />
          <div>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">Level 14 Focused</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Alex Chen</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const selected = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-3 text-left rounded-lg px-4 py-2 transition ${
                selected
                  ? 'bg-zinc-100 text-zinc-900 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-xs tracking-widest uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        className="mt-4 w-full rounded-2xl bg-primary px-3 py-3 font-bold text-on-primary transition hover:-translate-y-0.5"
        onClick={() => onChange?.('add-task')}
      >
        <span className="material-symbols-outlined align-middle">add</span> Add Task
      </button>
      <div className="mt-auto pt-4 border-t border-zinc-200">
        <button className="flex items-center gap-3 w-full text-zinc-500 hover:text-zinc-900 py-2">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-xs tracking-widest uppercase">Logout</span>
        </button>
      </div>
    </aside>
  );
}
