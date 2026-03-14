import useStore from '../../store/useStore'
import FolderTree from './FolderTree'
import './Sidebar.css'

export default function Sidebar() {
  const { createFolder, createNote } = useStore()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">✦ NoteFlow</span>
      </div>

      <div className="sidebar-actions">
        <button
          className="btn-action"
          title="新建文件夹"
          onClick={() => createFolder('新文件夹')}
        >
          <span>📁</span> 新建文件夹
        </button>
        <button
          className="btn-action btn-primary"
          title="新建笔记"
          onClick={() => createNote()}
        >
          <span>✏️</span> 新建笔记
        </button>
      </div>

      <div className="sidebar-tree">
        <FolderTree />
      </div>
    </aside>
  )
}
