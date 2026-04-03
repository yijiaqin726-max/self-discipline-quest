import useStore from '../../store/useStore'
import './EmptyState.css'

export default function EmptyState() {
  const { createNote, folders } = useStore()

  return (
    <div className="empty-state">
      <div className="empty-icon">✦</div>
      <h2 className="empty-title">NoteFlow</h2>
      <p className="empty-desc">选择一篇笔记开始编辑，或者创建一篇新笔记</p>
      <button className="empty-btn" onClick={() => createNote()}>
        ✏️ &nbsp;新建笔记
      </button>
      {folders.length === 0 && (
        <p className="empty-hint">提示：点击左侧"新建文件夹"可以创建文件夹来整理笔记</p>
      )}
    </div>
  )
}
