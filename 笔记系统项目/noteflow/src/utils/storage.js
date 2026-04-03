const STORAGE_KEY = 'noteflow_data'

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { folders: [], notes: [] }
    const data = JSON.parse(raw)
    if (!Array.isArray(data.folders) || !Array.isArray(data.notes)) {
      return { folders: [], notes: [] }
    }
    return data
  } catch {
    return { folders: [], notes: [] }
  }
}

export function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('NoteFlow: localStorage quota exceeded. Cannot save.')
      alert('存储空间已满，无法保存笔记。请删除一些旧笔记后重试。')
    }
  }
}

/**
 * BFS to collect all descendant folder IDs (not including folderId itself)
 */
export function getDescendantIds(folderId, allFolders) {
  const result = []
  const queue = [folderId]
  const visited = new Set()

  while (queue.length > 0) {
    const current = queue.shift()
    if (visited.has(current)) continue
    visited.add(current)

    const children = allFolders.filter(f => f.parentId === current)
    for (const child of children) {
      result.push(child.id)
      queue.push(child.id)
    }
  }

  return result
}
