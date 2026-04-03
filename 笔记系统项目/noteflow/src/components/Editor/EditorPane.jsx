import { useEffect, useRef } from 'react'

export default function EditorPane({ content, onChange, textareaRef, noteId }) {
  // Undo/redo history: array of { content, selStart, selEnd }
  const historyRef = useRef([{ content, selStart: 0, selEnd: 0 }])
  const historyIndexRef = useRef(0)
  const isUndoRedoRef = useRef(false)
  const debounceTimerRef = useRef(null)

  // Reset history when switching notes
  useEffect(() => {
    historyRef.current = [{ content, selStart: 0, selEnd: 0 }]
    historyIndexRef.current = 0
  }, [noteId])

  // Push snapshot to history on content change (debounced 400ms)
  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false
      return
    }

    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      const current = historyRef.current[historyIndexRef.current]
      if (content === current?.content) return

      const ta = textareaRef.current
      const selStart = ta ? ta.selectionStart : 0
      const selEnd = ta ? ta.selectionEnd : 0

      // Trim redo stack and push new entry
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
      historyRef.current.push({ content, selStart, selEnd })
      historyIndexRef.current = historyRef.current.length - 1

      // Cap history size to 200 entries
      if (historyRef.current.length > 200) {
        historyRef.current = historyRef.current.slice(-200)
        historyIndexRef.current = historyRef.current.length - 1
      }
    }, 400)

    return () => clearTimeout(debounceTimerRef.current)
  }, [content])

  const handleKeyDown = e => {
    const ctrl = e.ctrlKey || e.metaKey

    // Undo: Ctrl+Z
    if (ctrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      if (historyIndexRef.current > 0) {
        historyIndexRef.current--
        isUndoRedoRef.current = true
        const { content: prev, selStart, selEnd } = historyRef.current[historyIndexRef.current]
        onChange(prev)
        requestAnimationFrame(() => {
          const ta = textareaRef.current
          if (ta) ta.setSelectionRange(selStart, selEnd)
        })
      }
      return
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyIndexRef.current++
        isUndoRedoRef.current = true
        const { content: next, selStart, selEnd } = historyRef.current[historyIndexRef.current]
        onChange(next)
        requestAnimationFrame(() => {
          const ta = textareaRef.current
          if (ta) ta.setSelectionRange(selStart, selEnd)
        })
      }
      return
    }

    // Tab: insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.target
      const newValue =
        content.slice(0, selectionStart) + '  ' + content.slice(selectionEnd)
      onChange(newValue)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2
      })
    }
  }

  return (
    <div className="editor-pane">
      <div className="pane-label">编辑</div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder="开始写作…支持 Markdown 语法"
      />
    </div>
  )
}
