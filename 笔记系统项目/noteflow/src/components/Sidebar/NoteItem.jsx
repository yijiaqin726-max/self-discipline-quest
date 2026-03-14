import { useState, useRef, useEffect } from 'react'
import useStore from '../../store/useStore'

export default function NoteItem({ note, depth }) {
  const { selectedNoteId, selectNote, renameNote, deleteNote } = useStore()
  const isSelected = note.id === selectedNoteId

  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(note.title)
  const [contextMenu, setContextMenu] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isRenaming])

  useEffect(() => {
    if (!contextMenu) return
    const handler = () => setContextMenu(null)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [contextMenu])

  const commitRename = () => {
    const trimmed = renameValue.trim()
    if (trimmed) renameNote(note.id, trimmed)
    else setRenameValue(note.title)
    setIsRenaming(false)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') {
      setRenameValue(note.title)
      setIsRenaming(false)
    }
  }

  const handleContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    const x = Math.min(e.clientX, window.innerWidth - 160)
    const y = Math.min(e.clientY, window.innerHeight - 80)
    setContextMenu({ x, y })
  }

  const formatDate = ts => {
    const diff = Date.now() - ts
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return `${Math.floor(diff / 86400000)}天前`
  }

  return (
    <>
      <div
        className={`note-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => !isRenaming && selectNote(note.id)}
        onDoubleClick={() => { setIsRenaming(true); setRenameValue(note.title) }}
        onContextMenu={handleContextMenu}
      >
        <span className="note-icon">📄</span>
        {isRenaming ? (
          <input
            ref={inputRef}
            className="rename-input"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="note-title">{note.title}</span>
        )}
        <span className="note-date">{formatDate(note.updatedAt)}</span>
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => { setIsRenaming(true); setRenameValue(note.title); setContextMenu(null) }}>
            重命名
          </button>
          <button
            className="danger"
            onClick={() => { deleteNote(note.id); setContextMenu(null) }}
          >
            删除笔记
          </button>
        </div>
      )}
    </>
  )
}
