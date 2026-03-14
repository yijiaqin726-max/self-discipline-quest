export default function Divider({ onMouseDown }) {
  return (
    <div
      className="editor-divider"
      onMouseDown={onMouseDown}
      title="拖拽调整宽度"
    />
  )
}
