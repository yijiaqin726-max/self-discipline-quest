# ⚔️ 自律Quest —— 游戏化人生管理系统

> 把自律变成一场 RPG 冒险，用经验值、技能熟练度和成就奖励激励自己持续成长。

**[🚀 在线 Demo](https://yijiaqin726-max.github.io/Qin-Yijia/self-discipline-quest/)**

---

## ✨ 功能特性

| 模块 | 功能 |
|------|------|
| 🧙 **个人主页** | RPG 角色卡片，头像上传/预设，昵称座右铭行内编辑，等级称号系统，技能总览，目标列表 |
| 📅 **打卡日历** | 月历网格，点击打卡，连击统计🔥，粒子特效，清空确认 |
| 📋 **任务看板** | 任务增删改，3-5 XP 设置，关联技能，+1完成按钮，XP 浮动动画，按技能分组视图 |
| ✨ **技能熟练度** | 技能卡片进度条，100/200/500 里程碑奖励，自定义奖品，展开历史奖励 |
| 🍅 **番茄钟** | 圆形 SVG 进度，自定义专注/休息时长，浏览器通知，完成关联任务 +XP，今日番茄统计 |

---

## 🛠 技术栈

- **Vue 3** Composition API（`<script setup>`）
- **Vite** 构建工具
- **Pinia** 状态管理（跨组件数据共享）
- **Vue Router 4** 前端路由
- **LocalStorage** 数据持久化（封装为 `useStorage` composable）
- **纯手写 CSS** —— CSS 变量 + Scoped + 响应式布局
- **GitHub Actions** 自动部署至 GitHub Pages

---

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/your-username/self-discipline-quest.git
cd self-discipline-quest

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

---

## 📂 项目结构

```
src/
├── components/
│   └── common/
│       └── AppSidebar.vue     # 侧边栏 + 移动端底部 Tab Bar
├── composables/
│   └── useStorage.js          # LocalStorage 持久化封装
├── router/
│   └── index.js               # 路由配置
├── stores/
│   ├── profileStore.js        # 个人资料 + 等级计算
│   ├── calendarStore.js       # 打卡记录 + 连击统计
│   ├── questStore.js          # 任务 + XP 联动
│   └── skillStore.js          # 技能熟练度 + 里程碑奖励
├── views/
│   ├── ProfileView.vue        # 个人主页
│   ├── CalendarView.vue       # 打卡日历
│   ├── QuestsView.vue         # 任务看板
│   ├── SkillsView.vue         # 技能熟练度
│   └── TimerView.vue          # 番茄钟
├── style.css                  # 全局样式 & CSS 变量
└── main.js                    # 入口文件
```

---

## 🌐 部署至 GitHub Pages

1. Fork 或 Push 本仓库至你的 GitHub 账号
2. 进入仓库 → **Settings** → **Pages**
3. Source 选择 **GitHub Actions**
4. 推送代码到 `main` 分支，自动触发部署

---

## 📄 License

MIT
