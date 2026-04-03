import './Toolbar.css'

const FONT_SIZES = [12, 14, 15, 16, 18, 20, 24]

export default function Toolbar({ textareaRef, content, onChange, fontSize, onFontSizeChange }) {
  const applyFormat = (type) => {
    const ta = textareaRef.current
    if (!ta) return

    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const before = content.slice(0, start)
    const after = content.slice(end)

    let newContent, newStart, newEnd

    if (type === 'bold') {
      if (selected) {
        newContent = before + `**${selected}**` + after
        newStart = start + 2
        newEnd = end + 2
      } else {
        newContent = before + '****' + after
        newStart = newEnd = start + 2
      }
    } else if (type === 'underline') {
      if (selected) {
        newContent = before + `<u>${selected}</u>` + after
        newStart = start + 3
        newEnd = end + 3
      } else {
        newContent = before + '<u></u>' + after
        newStart = newEnd = start + 3
      }
    } else if (type === 'highlight') {
      if (selected) {
        newContent = before + `<mark>${selected}</mark>` + after
        newStart = start + 6
        newEnd = end + 6
      } else {
        newContent = before + '<mark></mark>' + after
        newStart = newEnd = start + 6
      }
    } else if (type === 'h1' || type === 'h2') {
      const prefix = type === 'h1' ? '# ' : '## '
      // Find start of current line
      const lineStart = before.lastIndexOf('\n') + 1
      const lineContent = content.slice(lineStart)
      // Strip existing heading prefix (up to 6 #)
      const stripped = lineContent.replace(/^#{1,6} /, '')
      newContent = content.slice(0, lineStart) + prefix + stripped
      // Adjust cursor: move by difference in prefix length
      const oldPrefixLen = lineContent.length - stripped.length
      const diff = prefix.length - oldPrefixLen
      newStart = start + diff
      newEnd = end + diff
    }

    onChange(newContent)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(newStart, newEnd)
    })
  }

  const handleExportPDF = () => {
    document.body.classList.add('print-mode')
    window.print()
    setTimeout(() => document.body.classList.remove('print-mode'), 500)
  }

  return (
    <div className="toolbar-bar">
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => applyFormat('h1')} title="一级标题 H1">
          H1
        </button>
        <button className="toolbar-btn" onClick={() => applyFormat('h2')} title="二级标题 H2">
          H2
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="toolbar-group">
        <button className="toolbar-btn toolbar-btn--bold" onClick={() => applyFormat('bold')} title="加粗 (Ctrl+B)">
          B
        </button>
        <button className="toolbar-btn toolbar-btn--underline" onClick={() => applyFormat('underline')} title="下划线">
          U
        </button>
        <button className="toolbar-btn toolbar-btn--highlight" onClick={() => applyFormat('highlight')} title="荧光笔高亮">
          <span className="highlight-icon">A</span>
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="toolbar-group">
        <label className="toolbar-label">字号</label>
        <select
          className="toolbar-select"
          value={fontSize}
          onChange={e => onFontSizeChange(Number(e.target.value))}
          title="调整预览字体大小"
        >
          {FONT_SIZES.map(s => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>
      </div>

      <div className="toolbar-sep" />

      <button className="toolbar-btn toolbar-btn--pdf" onClick={handleExportPDF} title="导出为 PDF">
        导出 PDF
      </button>
    </div>
  )
}
