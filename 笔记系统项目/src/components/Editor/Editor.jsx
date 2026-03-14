import { useState, useRef, useEffect } from 'react'
import useStore from '../../store/useStore'
import EditorPane from './EditorPane'
import PreviewPane from './PreviewPane'
import Divider from './Divider'
import './Editor.css'

export default function Editor() {
  const { notes, selectedNoteId, renameNote, updateNoteContent, saveNote } = useStore()
  const note = notes.find(n => n.id === selectedNoteId)

  const [splitPos, setSplitPos] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, pos: 50 })

  // Debounced auto-save
  useEffect(() => {
    if (!note) return
    const timer = setTimeout(() => saveNote(note.id), 500)
    return () => clearTimeout(timer)
  }, [note?.content])

  const handleDividerMouseDown = e => {
    e.preventDefault()
    isDragging.current = true
    dragStart.current = { x: e.clientX, pos: splitPos }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    const onMouseMove = e => {
      if (!isDragging.current || !containerRef.current) return
      const { width } = containerRef.current.getBoundingClientRect()
      const delta = ((e.clientX - dragStart.current.x) / width) * 100
      const newPos = Math.min(80, Math.max(20, dragStart.current.pos + delta))
      setSplitPos(newPos)
    }

    const onMouseUp = () => {
      isDragging.current = false
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (!note) return null

  const wordCount = note.content.replace(/\s/g, '').length

  return (
    <div className="editor-root">
      {/* Title bar */}
      <div className="editor-titlebar">
        <input
          className="editor-title-input"
          value={note.title}
          onChange={e => renameNote(note.id, e.target.value)}
          placeholder="笔记标题"
        />
        <span className="editor-meta">{wordCount} 字</span>
      </div>

      {/* Split pane */}
      <div className="editor-split" ref={containerRef}>
        <div className="editor-left" style={{ flex: `0 0 ${splitPos}%` }}>
          <EditorPane
            content={note.content}
            onChange={content => updateNoteContent(note.id, content)}
          />
        </div>
        <Divider onMouseDown={handleDividerMouseDown} />
        <div className="editor-right">
          <PreviewPane content={note.content} />
        </div>
      </div>
    </div>
  )
}
