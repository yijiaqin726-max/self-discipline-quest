import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAppStore, AppActions } from '../stores/appStore';

export function Settings() {
  const store = useAppStore();
  const [settings, setSettings] = useState({});
  const [notifications, setNotifications] = useState({ focus: true, weekly: false, achievements: true });

  useEffect(() => {
    setSettings(store.getState().settings || {});
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    AppActions.updateSettings(newSettings);
  };

  const toggleNotification = (key) => {
    const newNotifs = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifs);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <header className="sticky top-0 right-0 z-30 ml-64 flex items-center justify-between border-b border-gray-100 bg-white/70 px-10 py-5 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-gray-900">系统设置</h2>
      </header>

      <main className="ml-64 p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">设置</h1>
            <p className="mt-2 text-sm text-gray-600">个性化你的游戏化学习体验</p>
          </div>

          {/* Pomodoro Settings */}
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8">
            <h3 className="text-lg font-bold text-gray-900">番茄钟设置</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">专注时长（分钟）</label>
                <input
                  type="number"
                  value={settings.focusDuration || 25}
                  onChange={(e) => updateSetting('focusDuration', parseInt(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  min="5"
                  max="60"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">休息时长（分钟）</label>
                <input
                  type="number"
                  value={settings.breakDuration || 5}
                  onChange={(e) => updateSetting('breakDuration', parseInt(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </section>

          {/* Daily Goals */}
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8">
            <h3 className="text-lg font-bold text-gray-900">日常目标</h3>
            <div>
              <label className="text-sm font-semibold text-gray-700">每日专注目标（小时）</label>
              <input
                type="number"
                value={settings.dailyGoal || 4}
                onChange={(e) => updateSetting('dailyGoal', parseInt(e.target.value))}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                min="1"
                max="12"
              />
            </div>
          </section>

          {/* Notification Settings */}
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8">
            <h3 className="text-lg font-bold text-gray-900">通知设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-gray-900">专注提醒</p>
                  <p className="text-sm text-gray-600">提醒开始专注与休息切换</p>
                </div>
                <button
                  onClick={() => toggleNotification('focus')}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    notifications.focus
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {notifications.focus ? '已开启' : '已关闭'}
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-gray-900">每周摘要</p>
                  <p className="text-sm text-gray-600">每周生成学习进度摘要</p>
                </div>
                <button
                  onClick={() => toggleNotification('weekly')}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    notifications.weekly
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {notifications.weekly ? '已开启' : '已关闭'}
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-gray-900">成就通知</p>
                  <p className="text-sm text-gray-600">解锁新成就时提醒</p>
                </div>
                <button
                  onClick={() => toggleNotification('achievements')}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    notifications.achievements
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {notifications.achievements ? '已开启' : '已关闭'}
                </button>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8">
            <h3 className="text-lg font-bold text-gray-900">数据管理</h3>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (window.confirm('确定要导出数据吗？')) {
                    const state = store.getState();
                    const dataStr = JSON.stringify(state, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `game-life-data-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                  }
                }}
                className="rounded-lg border border-primary bg-primary/10 px-4 py-2 font-semibold text-primary transition hover:bg-primary/20"
              >
                导出数据
              </button>
              <button
                onClick={() => {
                  if (window.confirm('确定要重置所有数据吗？此操作不可撤销。')) {
                    AppActions.resetToDefault();
                    setSettings({});
                    window.location.reload();
                  }
                }}
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100"
              >
                重置到默认
              </button>
            </div>
          </section>

          {/* About */}
          <section className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <h3 className="text-lg font-bold text-gray-900">关于</h3>
            <p className="mt-2 text-sm text-gray-600">游戏化人生 v1.0</p>
            <p className="mt-1 text-xs text-gray-500">一个将学习管理游戏化的系统</p>
          </section>
        </div>
      </main>
    </div>
  );
}
