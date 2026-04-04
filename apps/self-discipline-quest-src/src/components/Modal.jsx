import React from 'react';

export function TaskModal({ open, onClose, onCreate, initial = {} }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/10 p-4 backdrop-blur-md">
      <main className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_20px_40px_rgba(106,91,0,0.06)]">
        <header className="flex items-center justify-between px-8 py-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-on-surface">新建专注任务</h2>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">规划下一次高效冲刺</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-8 pb-8">
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-2">
              <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">任务标题</label>
              <input className="w-full border-none bg-transparent p-0 text-xl font-bold text-on-surface placeholder:text-surface-container-highest focus:ring-0" defaultValue={initial.title || ''} placeholder="你现在要完成什么？" />
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full w-1/3 bg-primary-container" />
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="flex flex-col gap-2">
                <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">截止日期</label>
                <div className="group flex cursor-pointer items-center gap-3 rounded-xl bg-surface-container px-4 py-3 text-on-surface transition-colors hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                  <span className="text-sm font-semibold">2024 年 3 月 14 日</span>
                  <span className="material-symbols-outlined ml-auto text-on-surface-variant transition-transform group-hover:translate-y-0.5">expand_more</span>
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">经验奖励</label>
                <div className="relative">
                  <input type="number" min="0" defaultValue={initial.xp || 250} className="w-full rounded-xl border-2 border-transparent bg-surface-container-low px-4 py-3 font-black text-on-surface-variant transition-all focus:border-primary-container focus:ring-0" />
                  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 text-[10px] font-black">
                    <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                    + 经验
                  </div>
                </div>
              </section>
            </div>

            <section className="flex flex-col gap-3">
              <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">优先级</label>
              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-surface-container p-1.5">
                <button className="rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-container-high">低</button>
                <button className="rounded-xl bg-surface-container-lowest px-4 py-2.5 text-sm font-bold text-on-surface shadow-sm ring-1 ring-black/5 transition-all">中</button>
                <button className="rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-container-high">高</button>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">分类 / 技能标签</label>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-4 py-2 text-xs font-black text-on-tertiary-container ring-1 ring-tertiary/10">
                  数学
                  <span className="material-symbols-outlined cursor-pointer text-[16px]">close</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-xs font-black text-on-secondary-container ring-1 ring-secondary/10">
                  研究
                  <span className="material-symbols-outlined cursor-pointer text-[16px]">close</span>
                </span>
                <button className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-outline-variant px-4 py-2 text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  添加技能
                </button>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">预计专注时长</label>
                <span className="text-sm font-black text-primary">45 <span className="text-[10px] font-medium text-on-surface-variant">分钟</span></span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-surface-container">
                <div className="absolute h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_0_8px_rgba(106,91,0,0.2)]" />
                <div className="absolute left-3/4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-primary bg-surface-container-lowest shadow-lg" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-outline-variant">
                <span>15m</span><span>30m</span><span>45m</span><span>60m</span><span>90m+</span>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">专注备注</label>
              <textarea className="w-full resize-none rounded-xl border-none bg-surface-container-low p-4 text-sm font-medium text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary-container/30" rows={4} defaultValue={initial.notes || ''} placeholder="拆分你的执行步骤，写下关键要求..." />
            </section>
          </div>
        </div>

        <footer className="flex gap-3 border-t border-surface-container bg-surface-container-low/50 p-6">
          <button onClick={onClose} className="flex-1 rounded-full bg-surface-container-high py-4 text-sm font-black tracking-wide text-on-surface transition-all active:scale-95 hover:bg-surface-container-highest">
            放弃创建
          </button>
          <button onClick={onCreate} className="group flex-[2] rounded-full bg-gradient-to-br from-primary to-primary-container py-4 text-sm font-black tracking-wide text-on-primary-container shadow-[0_10px_20px_rgba(106,91,0,0.15)] transition-all active:scale-95 hover:shadow-[0_15px_30px_rgba(106,91,0,0.2)]">
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              创建任务
            </span>
          </button>
        </footer>
      </main>

      <div className="pointer-events-none fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-white/70 px-6 py-3 shadow-2xl backdrop-blur-xl">
        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <p className="text-xs font-bold tracking-tight text-on-surface-variant">完成当前目标后，你将晋升为 <span className="font-black text-primary">15 级学者</span>。</p>
      </div>
    </div>
  );
}
