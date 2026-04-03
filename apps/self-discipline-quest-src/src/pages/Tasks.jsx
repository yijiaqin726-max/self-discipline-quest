import React from 'react';
import { Sidebar } from '../components/Sidebar';

export function Tasks() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar active="tasks" />
      <main className="ml-64 p-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <header>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Task Center</p>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-gray-900">All Tasks</h1>
            <p className="mt-2 text-sm text-gray-500">Use Dashboard to check off or remove tasks. This page is now reachable from the sidebar.</p>
          </header>

          <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-primary-container p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container/70">In Progress</p>
                <p className="mt-2 text-3xl font-black text-on-primary-container">2</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">To Do</p>
                <p className="mt-2 text-3xl font-black text-gray-900">1</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-green-700">Done</p>
                <p className="mt-2 text-3xl font-black text-green-700">1</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
