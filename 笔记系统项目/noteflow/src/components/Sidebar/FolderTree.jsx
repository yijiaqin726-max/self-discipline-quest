import useStore from '../../store/useStore'
import FolderItem from './FolderItem'
import NoteItem from './NoteItem'

export default function FolderTree({ parentId = null, depth = 0, visited = new Set() }) {
  const { folders, notes } = useStore()

  if (visited.has(parentId)) return null
  const nextVisited = new Set(visited)
  if (parentId !== null) nextVisited.add(parentId)

  const childFolders = folders
    .filter(f => f.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name, 'zh'))

  // Root-level notes (no folder)
  const rootNotes = parentId === null
    ? notes.filter(n => n.folderId === null).sort((a, b) => b.updatedAt - a.updatedAt)
    : []

  return (
    <>
      {childFolders.map(folder => (
        <FolderItem key={folder.id} folder={folder} depth={depth} visited={nextVisited} />
      ))}
      {rootNotes.map(note => (
        <NoteItem key={note.id} note={note} depth={depth} />
      ))}
    </>
  )
}
