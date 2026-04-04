import React from 'react';
import { Sidebar } from '../components/Sidebar';

export function Settings() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar active="settings" />
      <main className="ml-64 p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <header>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">系统配置</p>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-gray-900">设置</h1>
          </header>

          <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-gray-900">专注提醒</p>
                <p className="text-xs text-gray-500">提醒开始专注与休息切换</p>
              </div>
              <button className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary">已开启</button>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-gray-900">每周摘要</p>
                <p className="text-xs text-gray-500">每周自动生成进度摘要</p>
              </div>
              <button className="rounded-full bg-gray-200 px-4 py-2 text-xs font-bold text-gray-700">已关闭</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
