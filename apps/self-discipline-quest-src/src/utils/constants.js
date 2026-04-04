// 设计系统常量
export const DESIGN_SYSTEM = {
  colors: {
    primary: '#6A5B00', // 金黄
    primaryLight: '#EAB308',
    primaryContainer: '#F4E4A6',
    secondary: '#5A5A5A',
    secondaryLight: '#9E9E9E',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceContainerLow: '#F5F5F5',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.05)',
    md: '0 4px 8px rgba(0,0,0,0.08)',
    lg: '0 8px 16px rgba(0,0,0,0.12)',
  },
};

// 任务状态配置
export const TASK_STATUS = {
  todo: { label: '待办', color: 'bg-gray-100', textColor: 'text-gray-600', icon: 'pending' },
  'in-progress': { label: '进行中', color: 'bg-yellow-50', textColor: 'text-yellow-700', icon: 'schedule' },
  done: { label: '已完成', color: 'bg-green-50', textColor: 'text-green-700', icon: 'check_circle' },
  overdue: { label: '已逾期', color: 'bg-red-50', textColor: 'text-red-600', icon: 'error' },
};

// 优先级配置
export const PRIORITY_LEVELS = {
  low: { label: '低', color: 'bg-gray-100', textColor: 'text-gray-600' },
  medium: { label: '中', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
  high: { label: '高', color: 'bg-red-100', textColor: 'text-red-700' },
};

// 数据格式化工具
export const formatters = {
  formatTime: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  },

  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  },

  formatDateCN: (date) => {
    if (!date) return '';
    const d = new Date(date);
    const m = d.getMonth() + 1;
    const d2 = d.getDate();
    return `${d.getFullYear()} 年 ${m} 月 ${d2} 日`;
  },

  formatDayName: (dayIndex) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[dayIndex % 7];
  },

  formatHours: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    return `${mins}m`;
  },
};

// 验证工具
export const validators = {
  isOverdue: (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  },

  isToday: (date) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  isValidDate: (dateString) => {
    return !isNaN(Date.parse(dateString));
  },
};

// 计算工具
export const calculators = {
  // 获取今日任务统计
  getDailyStats: (tasks) => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter((t) => {
      const dueDate = new Date(t.dueDate).toDateString();
      return dueDate === today || t.status === 'in-progress';
    });

    return {
      total: todayTasks.length,
      completed: todayTasks.filter((t) => t.status === 'done').length,
      inProgress: todayTasks.filter((t) => t.status === 'in-progress').length,
      todo: todayTasks.filter((t) => t.status === 'todo').length,
      overdue: todayTasks.filter((t) => t.status === 'overdue').length,
    };
  },

  // 获取周任务统计
  getWeeklyStats: (tasks) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      completed: tasks.filter((t) => t.status === 'done' && new Date(t.createdAt) > weekAgo).length,
      totalXp: tasks
        .filter((t) => t.status === 'done' && new Date(t.createdAt) > weekAgo)
        .reduce((sum, t) => sum + t.xp, 0),
    };
  },

  // 计算下一级所需XP
  getXpToNextLevel: (currentXp, level) => {
    // 简单的计算方式：每级所需经验随级数增加
    const xpPerLevel = 500 * level;
    const currentLevelXp = 500 * (level - 1) * (level - 1) + 500;
    const nextLevelXp = currentLevelXp + xpPerLevel;
    return Math.max(0, nextLevelXp - currentXp);
  },
};
