# 🎮 自律-游戏化人生项目

这是一个整合多个子项目的游戏化人生管理系统集合。

## 🚀 核心项目

### 🏆 自律Quest —— 游戏化人生管理系统

把自律变成一场 RPG 冒险，用经验值、技能熟练度和成就奖励激励自己持续成长。

**[🎯 在线 Demo](https://yijiaqin726-max.github.io/Qin-Yijia/)**

#### ✨ 功能特性

| 模块 | 功能 |
|------|------|
| 🧙 **个人主页** | RPG 角色卡片，头像上传/预设，昵称座右铭行内编辑，等级称号系统，技能总览，目标列表 |
| 📅 **打卡日历** | 月历网格，点击打卡，连击统计🔥，粒子特效，清空确认 |
| 📋 **任务看板** | 任务增删改，3-5 XP 设置，关联技能，+1完成按钮，XP 浮动动画，按技能分组视图 |
| ✨ **技能熟练度** | 技能卡片进度条，100/200/500 里程碑奖励，自定义奖品，展开历史奖励 |
| 🍅 **番茄钟** | 圆形 SVG 进度，自定义专注/休息时长，浏览器通知，完成关联任务 +XP，今日番茄统计 |

#### 🛠 技术栈

- **React 18** + JSX
- **Vite** 构建工具
- **React Router** 前端路由
- **Tailwind CSS** 样式
- **Material Symbols** 图标
- **LocalStorage** 数据持久化
- **GitHub Actions** 自动部署至 GitHub Pages

#### 📂 项目结构

```
src/
├── components/       # React 组件库
│   ├── Sidebar.jsx
│   ├── TaskCard.jsx
│   ├── Timer.jsx
│   ├── Modal.jsx
│   ├── ProgressCard.jsx
│   ├── StatsSection.jsx
│   └── ...
├── pages/           # 页面组件
│   ├── Dashboard.jsx
│   ├── Progress.jsx
│   └── Calendar.jsx
├── App.jsx          # 路由中心
└── main.jsx         # 入口
```

#### 🚀 本地运行

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

#### 🌐 部署（GitHub Pages）

已通过 GitHub Actions 自动部署。推送到 `main` 分支后自动触发部署流程。

---

## 📁 仓库结构

```
自律-游戏化人生项目/
├── src/                           # React 项目源代码
├── public/                        # 静态资源
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署
├── vite.config.js                 # Vite 配置
├── package.json                   # 项目依赖
├── self-discipline-quest/         # 旧项目备份
├── stitch/                        # UI 设计原稿
├── PRD.md                         # 产品需求文档
└── TASKS.md                       # 任务列表
```

---

## 📝 相关文档

- [产品需求文档 (PRD)](./PRD.md)
- [任务跟踪 (TASKS)](./TASKS.md)
- [子项目 README](./self-discipline-quest/README.md)

---

## 📄 License

MIT
