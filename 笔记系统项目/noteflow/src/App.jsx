import { useEffect } from 'react'
import useStore from './store/useStore'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import EmptyState from './components/EmptyState/EmptyState'
import './App.css'

export default function App() {
  const { selectedNoteId, loadFromStorage } = useStore()

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        {selectedNoteId ? <Editor /> : <EmptyState />}
      </main>
    </div>
  )
}
