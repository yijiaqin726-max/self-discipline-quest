import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { loadFromStorage, saveToStorage, getDescendantIds } from '../utils/storage'

const useStore = create((set, get) => ({
  folders: [],
  notes: [],
  selectedNoteId: null,
  selectedFolderId: null,
  searchQuery: '',
  theme: 'light',

  // ── Persistence ──────────────────────────────────────────────
  loadFromStorage() {
    const data = loadFromStorage()
    const theme = localStorage.getItem('noteflow_theme') || 'light'
    document.documentElement.setAttribute('data-theme', theme)
    set({ folders: data.folders, notes: data.notes, theme })
  },

  _persist() {
    const { folders, notes } = get()
    saveToStorage({ folders, notes })
  },

  // ── Theme ─────────────────────────────────────────────────────
  toggleTheme() {
    const next = get().theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('noteflow_theme', next)
    set({ theme: next })
  },

  // ── Search ────────────────────────────────────────────────────
  setSearchQuery(q) {
    set({ searchQuery: q })
  },

  // ── Folder actions ────────────────────────────────────────────
  createFolder(name, parentId = null) {
    const folder = {
      id: uuidv4(),
      name: name || '新文件夹',
      parentId,
      createdAt: Date.now(),
    }
    set(state => ({ folders: [...state.folders, folder] }))
    get()._persist()
    return folder.id
  },

  renameFolder(id, newName) {
    if (!newName.trim()) return
    set(state => ({
      folders: state.folders.map(f =>
        f.id === id ? { ...f, name: newName.trim() } : f
      ),
    }))
    get()._persist()
  },

  deleteFolder(id) {
    const { folders, notes, selectedNoteId } = get()
    const descendantIds = getDescendantIds(id, folders)
    const deletedFolderIds = new Set([id, ...descendantIds])

    const survivingNotes = notes.filter(n => !deletedFolderIds.has(n.folderId))
    const deletedNoteIds = new Set(notes.filter(n => deletedFolderIds.has(n.folderId)).map(n => n.id))

    set(state => ({
      folders: state.folders.filter(f => !deletedFolderIds.has(f.id)),
      notes: survivingNotes,
      selectedNoteId: deletedNoteIds.has(selectedNoteId) ? null : selectedNoteId,
      selectedFolderId: deletedFolderIds.has(state.selectedFolderId) ? null : state.selectedFolderId,
    }))
    get()._persist()
  },

  selectFolder(id) {
    set({ selectedFolderId: id })
  },

  // ── Note actions ──────────────────────────────────────────────
  createNote(folderId = null) {
    const targetFolderId = folderId ?? get().selectedFolderId
    const note = {
      id: uuidv4(),
      title: '无标题笔记',
      content: '',
      folderId: targetFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set(state => ({
      notes: [...state.notes, note],
      selectedNoteId: note.id,
    }))
    get()._persist()
    return note.id
  },

  renameNote(id, newTitle) {
    set(state => ({
      notes: state.notes.map(n =>
        n.id === id ? { ...n, title: newTitle, updatedAt: Date.now() } : n
      ),
    }))
    get()._persist()
  },

  deleteNote(id) {
    set(state => ({
      notes: state.notes.filter(n => n.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    }))
    get()._persist()
  },

  selectNote(id) {
    set({ selectedNoteId: id })
  },

  updateNoteContent(id, content) {
    set(state => ({
      notes: state.notes.map(n =>
        n.id === id ? { ...n, content, updatedAt: Date.now() } : n
      ),
    }))
  },

  saveNote(id) {
    get()._persist()
  },
}))

export default useStore
