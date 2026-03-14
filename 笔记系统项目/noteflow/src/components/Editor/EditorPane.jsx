export default function EditorPane({ content, onChange, textareaRef }) {
  const handleKeyDown = e => {
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
