import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function PreviewPane({ content }) {
  return (
    <div className="preview-pane">
      <div className="pane-label">预览</div>
      <div className="prose">
        {content
          ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          : <p className="prose-empty">预览将在此处显示…</p>
        }
      </div>
    </div>
  )
}
