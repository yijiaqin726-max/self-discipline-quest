import { useState, useRef, useEffect } from 'react'
import useStore from '../../store/useStore'
import FolderTree from './FolderTree'
import NoteItem from './NoteItem'

export default function FolderItem({ folder, depth }) {
  const { notes, selectedFolderId, selectFolder, renameFolder, deleteFolder, createNote, createFolder } = useStore()
  const isSelected = folder.id === selectedFolderId

  const [isExpanded, setIsExpanded] = useState(true)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(folder.name)
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
    if (trimmed) renameFolder(folder.id, trimmed)
    else setRenameValue(folder.name)
    setIsRenaming(false)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') {
      setRenameValue(folder.name)
      setIsRenaming(false)
    }
  }

  const handleContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    const x = Math.min(e.clientX, window.innerWidth - 180)
    const y = Math.min(e.clientY, window.innerHeight - 140)
    setContextMenu({ x, y })
  }

  const folderNotes = notes
    .filter(n => n.folderId === folder.id)
    .sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <>
      <div
        className={`folder-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => { selectFolder(folder.id); setIsExpanded(e => !e) }}
        onDoubleClick={() => { setIsRenaming(true); setRenameValue(folder.name) }}
        onContextMenu={handleContextMenu}
      >
        <span className="chevron">{isExpanded ? '▾' : '▸'}</span>
        <span className="folder-icon">📁</span>
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
          <span className="folder-name">{folder.name}</span>
        )}
      </div>

      {isExpanded && (
        <div className="folder-children">
          <FolderTree parentId={folder.id} depth={depth + 1} />
          {folderNotes.map(note => (
            <NoteItem key={note.id} note={note} depth={depth + 1} />
          ))}
        </div>
      )}

      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => { createNote(folder.id); setContextMenu(null) }}>
            新建笔记
          </button>
          <button onClick={() => { createFolder('新文件夹', folder.id); setContextMenu(null) }}>
            新建子文件夹
          </button>
          <button onClick={() => { setIsRenaming(true); setRenameValue(folder.name); setContextMenu(null) }}>
            重命名
          </button>
          <button
            className="danger"
            onClick={() => { deleteFolder(folder.id); setContextMenu(null) }}
          >
            删除文件夹
          </button>
        </div>
      )}
    </>
  )
}
