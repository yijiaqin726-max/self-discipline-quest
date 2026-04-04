import React from 'react';
import { TASK_STATUS, PRIORITY_LEVELS } from '../../utils/constants';

// StatusTag 组件 - 任务状态标签
export function StatusTag({ status, className = '' }) {
  const config = TASK_STATUS[status] || TASK_STATUS.todo;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${config.color} ${config.textColor} ${className}`}>
      <span className="material-symbols-outlined text-sm">{config.icon}</span>
      {config.label}
    </span>
  );
}

// PriorityTag 组件 - 优先级标签
export function PriorityTag({ priority, className = '' }) {
  const config = PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.medium;
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${config.color} ${config.textColor} ${className}`}>
      {config.label}
    </span>
  );
}

// XPBadge 组件 - XP显示
export function XPBadge({ xp, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-yellow-50 font-bold text-yellow-700 ${sizeClasses[size]} ${className}`}>
      <span className="material-symbols-outlined filled-icon text-sm">stars</span>+{xp} XP
    </span>
  );
}

// ProgressBar 组件 - 进度条
export function ProgressBar({ value, max = 100, showLabel = true, className = '' }) {
  const percentage = (value / max) * 100;
  return (
    <div className={className}>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="progress-gradient h-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && (
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>{value}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

// StatCard 组件 - 统计卡片
export function StatCard({ icon, label, value, unit = '', subtext = '', clickable = false }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all ${clickable ? 'cursor-pointer hover:shadow-md' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{value}</span>
            {unit && <span className="font-semibold text-gray-500">{unit}</span>}
          </p>
          {subtext && <p className="mt-2 text-xs text-gray-500">{subtext}</p>}
        </div>
        {icon && <span className={`material-symbols-outlined text-2xl ${icon.color || 'text-gray-400'}`}>{icon.name}</span>}
      </div>
    </div>
  );
}

// EmptyState 组件 - 空状态
export function EmptyState({ icon = 'inbox', title = '暂无内容', subtitle = '开始创建你的第一条任务吧' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
      <span className="material-symbols-outlined mb-4 text-4xl text-gray-300">{icon}</span>
      <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

// SectionHeader 组件 - 分区标题
export function SectionHeader({ label = '', title = '', subtitle = '' }) {
  return (
    <header className="mb-6">
      {label && <p className="text-xs font-bold uppercase tracking-widest text-primary">{label}</p>}
      {title && <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">{title}</h2>}
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
    </header>
  );
}

// TaskCardCompact 组件 - 任务卡片（紧凑版）
export function TaskCardCompact({ task, onToggle, onDelete, onSelect, actions = [] }) {
  const isDone = task.status === 'done';
  const isOverdue = task.status === 'overdue';
  const isActive = task.status === 'in-progress';

  return (
    <div
      className={`group flex items-center justify-between rounded-xl border bg-white p-4 transition-all ${
        isDone
          ? 'border-gray-100 bg-gray-50 opacity-60'
          : isOverdue
            ? 'border-red-100 bg-red-50/20'
            : isActive
              ? 'border-yellow-100 bg-yellow-50/20'
              : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={() => onToggle?.(task.id)}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isDone ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 hover:border-primary'
          }`}
          title={isDone ? '标记为待办' : '标记为完成'}
        >
          {isDone && <span className="material-symbols-outlined text-sm">check</span>}
        </button>

        <div className="min-w-0 flex-1">
          <h4 className={`truncate font-semibold ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {task.category && <span className="text-[10px] inline-block rounded bg-gray-100 px-2 py-0.5 text-gray-600">{task.category}</span>}
            {task.dueDate && <span className="text-[10px] inline-block text-gray-500">{task.dueDate}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-4">
        {task.xp && <XPBadge xp={task.xp} size="sm" />}
        {task.priority && <PriorityTag priority={task.priority} />}
        <button
          onClick={() => onDelete?.(task.id)}
          className="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          title="删除"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}

// LoadingSpinner 组件
export function LoadingSpinner({ size = 'md' }) {
  const sizeClass = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size] || 'h-8 w-8';
  return (
    <div className={`${sizeClass} animate-spin rounded-full border-2 border-gray-200 border-t-primary`} />
  );
}

// Badge 组件 - 通用徽章
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>{children}</span>;
}

// Button 组件 - 通用按钮（可选）
export function Button({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', ...props }) {
  const baseClass = 'rounded-lg font-semibold transition-all inline-flex items-center gap-2 justify-center';
  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const variantClass = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 active:scale-95',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'text-gray-600 hover:bg-gray-100',
  }[variant];

  return (
    <button disabled={disabled || loading} className={`${baseClass} ${sizeClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} {...props}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
