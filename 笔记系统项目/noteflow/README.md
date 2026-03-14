# ✦ NoteFlow

一款运行在浏览器中的 Markdown 笔记应用，无需安装，打开即用，数据保存在本地。

**[🚀 在线演示 →](https://yijiaqin726-max.github.io/Qin-Yijia/)**

---

## 功能特性

### 编辑器
- **双栏分屏** — 左侧编辑 Markdown，右侧实时渲染预览
- **可拖拽分隔线** — 自由调整编辑区与预览区的宽度比例（20%–80%）
- **Markdown 全语法支持** — 标题、加粗、斜体、代码块（语法高亮）、表格、任务列表、引用块等
- **Tab 键缩进** — 编辑区内 Tab 键插入 2 个空格，不丢失焦点
- **自动保存** — 停止输入 500ms 后自动保存，无感知
- **字数统计** — 标题栏实时显示当前笔记字符数

### 文件管理
- **无限层级文件夹** — 支持任意深度嵌套，展开/折叠
- **内联重命名** — 双击文件夹或笔记名称，直接输入新名称，Enter 确认，Escape 取消
- **右键菜单** — 右键文件夹/笔记可新建子项、重命名、删除
- **递归删除** — 删除文件夹会同时删除其所有子文件夹和笔记
- **笔记排序** — 文件夹内笔记按最近修改时间倒序排列
- **相对时间** — 鼠标悬停笔记时显示"X 分钟前 / X 小时前"

### 数据存储
- **本地优先** — 所有数据保存在浏览器 `localStorage`，无需服务器
- **刷新不丢失** — 关闭标签页再打开，数据完整保留
- **无需账号** — 打开页面即可使用，无注册登录流程

---

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) 18 或以上版本

### 安装与运行

```bash
# 进入项目目录
cd noteflow

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后在浏览器打开 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
npm run build
```

构建产物输出至 `dist/` 目录，可直接部署到任意静态托管服务（Vercel、Nginx、GitHub Pages 等）。

---

## 使用指南

### 创建笔记

1. 点击侧边栏顶部 **✏️ 新建笔记** 按钮，在根目录创建笔记
2. 或右键已有文件夹 → **新建笔记**，将笔记创建到该文件夹内

### 整理文件夹

1. 点击 **📁 新建文件夹** 创建根目录文件夹
2. 右键文件夹 → **新建子文件夹** 创建嵌套结构
3. **双击**名称进行重命名
4. 点击文件夹名称旁的箭头展开/折叠

### 编写 Markdown

在左侧编辑区输入 Markdown，右侧实时预览渲染效果。常用语法：

| 语法 | 效果 |
|------|------|
| `# 标题` | 一级标题 |
| `**加粗**` | **加粗** |
| `*斜体*` | *斜体* |
| `` `代码` `` | 行内代码 |
| `- [ ] 任务` | 任务列表 |
| ` ```js ` | 代码块（JS 高亮） |
| `> 引用` | 引用块 |
| `\| 列 \| 列 \|` | 表格 |

### 调整分栏比例

拖拽编辑区与预览区之间的 **竖向分隔线** 可自由调整两侧宽度（范围：20%–80%）。

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | UI 框架 |
| Vite | 8 | 构建工具 |
| Zustand | 最新 | 全局状态管理 |
| react-markdown | 最新 | Markdown 渲染 |
| remark-gfm | 最新 | GitHub 风格 Markdown 扩展 |
| uuid | 最新 | 唯一 ID 生成 |

---

## 项目结构

```
noteflow/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                    # 应用入口
    ├── App.jsx                     # 根组件（布局 + 初始化）
    ├── App.css                     # 全局样式 + CSS 设计变量
    ├── store/
    │   └── useStore.js             # Zustand 状态（所有数据与操作）
    ├── utils/
    │   └── storage.js              # localStorage 工具函数
    └── components/
        ├── Sidebar/
        │   ├── Sidebar.jsx         # 侧边栏容器
        │   ├── FolderTree.jsx      # 递归文件夹树
        │   ├── FolderItem.jsx      # 文件夹行（展开/重命名/右键）
        │   ├── NoteItem.jsx        # 笔记行（选中/重命名/右键）
        │   └── Sidebar.css
        ├── Editor/
        │   ├── Editor.jsx          # 分栏容器（拖拽 + 自动保存）
        │   ├── EditorPane.jsx      # 左侧 Markdown 编辑区
        │   ├── PreviewPane.jsx     # 右侧渲染预览
        │   ├── Divider.jsx         # 可拖拽分隔线
        │   └── Editor.css
        └── EmptyState/
            ├── EmptyState.jsx      # 未选中笔记时的占位界面
            └── EmptyState.css
```

---

## 数据格式

所有数据以 JSON 格式保存在 `localStorage`，key 为 `noteflow_data`：

```json
{
  "folders": [
    {
      "id": "uuid-string",
      "name": "文件夹名称",
      "parentId": null,
      "createdAt": 1710000000000
    }
  ],
  "notes": [
    {
      "id": "uuid-string",
      "title": "笔记标题",
      "content": "# Markdown 内容\n\n正文...",
      "folderId": "父文件夹 uuid 或 null",
      "createdAt": 1710000000000,
      "updatedAt": 1710000000000
    }
  ]
}
```

可在浏览器 **DevTools → Application → Local Storage** 中查看和手动备份数据。

---

## 开发计划

| 版本 | 功能 |
|------|------|
| **v0.2**（进行中）| 全文搜索、深色模式、格式化工具栏、专注模式、笔记导出 |
| **v0.5** | 拖拽排序、标签系统、导入 .md 文件、主题设置 |
| **v1.0** | AI 写作辅助（Claude API）、跨笔记问答 |
| **v1.1** | 协作功能、移动端适配 |

---

## 已知限制

- **存储上限**：localStorage 约 5MB，笔记量极大时可能触碰上限
- **无回收站**：删除操作不可撤销（计划在 v0.2 添加）
- **单标签页**：同时打开多个标签页可能导致数据不同步
- **无导出功能**：当前版本不支持导出，请定期在 DevTools 中备份数据

---

## 许可证

MIT License
