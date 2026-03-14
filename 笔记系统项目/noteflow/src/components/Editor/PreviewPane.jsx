import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function PreviewPane({ content, fontSize }) {
  return (
    <div className="preview-pane">
      <div className="pane-label">预览</div>
      <div className="prose" style={{ fontSize: fontSize ? `${fontSize}px` : undefined }}>
        {content
          ? <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
          : <p className="prose-empty">预览将在此处显示…</p>
        }
      </div>
    </div>
  )
}
