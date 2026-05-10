import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getNotes, saveNotes, generateId, getTripById } from '../utils/storage'
import { formatDate } from '../utils/helpers'
import { useToast, ToastContainer } from '../components/Toast'

export default function TripNotesPage() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [notes, setNotes] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState({ title: '', content: '', stopId: '' })
  const [isNew, setIsNew] = useState(false)
  const autoSaveTimer = useRef(null)
  const { toasts, toast } = useToast()

  useEffect(() => {
    const t = getTripById(tripId)
    if (t) { setTrip(t); setNotes(getNotes(tripId)) }
  }, [tripId])

  const activeNote = notes.find(n => n.id === activeId)

  const openNote = (note) => {
    setActiveId(note.id)
    setDraft({ title: note.title || '', content: note.content || '', stopId: note.stopId || '' })
    setIsNew(false)
  }

  const newNote = () => {
    setActiveId(null)
    setDraft({ title: '', content: '', stopId: '' })
    setIsNew(true)
  }

  const saveNote = (d = draft) => {
    if (!d.content.trim() && !d.title.trim()) return
    let updated
    if (isNew || !activeId) {
      const note = { id: generateId(), ...d, createdAt: new Date().toISOString() }
      updated = [note, ...notes]
      setActiveId(note.id)
      setIsNew(false)
    } else {
      updated = notes.map(n => n.id === activeId ? { ...n, ...d, updatedAt: new Date().toISOString() } : n)
    }
    setNotes(updated)
    saveNotes(tripId, updated)
  }

  const handleChange = (field, val) => {
    const d = { ...draft, [field]: val }
    setDraft(d)
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => { saveNote(d) }, 2000)
  }

  const handleDelete = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(tripId, updated)
    if (activeId === id) { setActiveId(null); setDraft({ title: '', content: '', stopId: '' }); setIsNew(false) }
    toast.success('Note deleted.')
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-6">
          <p className="text-xs text-ink-muted mb-1">
            <Link to={`/trips/${tripId}/build`} className="hover:text-terracotta">← Back to Builder</Link>
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">Trip Notes 📝</h1>
          {trip && <p className="text-ink-muted text-sm mt-1">{trip.name}</p>}
        </div>

        <div className="grid md:grid-cols-5 gap-6 min-h-[500px]">
          {/* Sidebar */}
          <aside className="md:col-span-2 space-y-3">
            <button onClick={newNote} className="btn-primary w-full">+ New Note</button>

            {notes.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-sm text-ink-muted">No notes yet. Add one!</p>
              </div>
            ) : (
              notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => openNote(note)}
                  className={`card cursor-pointer p-3 transition-all duration-200 group ${
                    activeId === note.id ? 'border-terracotta shadow-card-hover' : 'hover:border-warm-border hover:shadow-card-hover'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-ink truncate">{note.title || 'Untitled'}</p>
                      <p className="text-xs text-ink-muted line-clamp-2 mt-0.5">{note.content}</p>
                      <p className="text-xs text-ink-light mt-1">{formatDate(note.createdAt, 'MMM d, HH:mm')}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(note.id) }}
                      className="opacity-0 group-hover:opacity-100 text-ink-light hover:text-red-400 transition-all text-xs flex-shrink-0"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </aside>

          {/* Editor */}
          <div className="md:col-span-3">
            {!isNew && !activeId ? (
              <div className="card p-12 text-center h-full flex flex-col items-center justify-center">
                <p className="text-4xl mb-3">✍️</p>
                <p className="font-display text-xl font-bold text-ink mb-2">Select a note</p>
                <p className="text-ink-muted text-sm">Or create a new one to start writing.</p>
              </div>
            ) : (
              <div className="card p-5 flex flex-col h-full">
                <input
                  type="text"
                  value={draft.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Note title..."
                  className="font-display text-xl font-bold text-ink border-0 focus:outline-none bg-transparent mb-3 w-full"
                />

                {/* Stop selector */}
                {trip?.stops?.length > 0 && (
                  <div className="mb-3">
                    <select
                      value={draft.stopId}
                      onChange={e => handleChange('stopId', e.target.value)}
                      className="input-field text-sm py-1.5 w-auto"
                    >
                      <option value="">— Link to a city —</option>
                      {trip.stops.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.city}</option>)}
                    </select>
                  </div>
                )}

                <textarea
                  value={draft.content}
                  onChange={e => handleChange('content', e.target.value)}
                  placeholder="Start writing... Auto-saves after 2 seconds of inactivity."
                  className="flex-1 border-0 focus:outline-none bg-transparent resize-none text-sm text-ink leading-relaxed min-h-[300px] font-body"
                />

                <div className="mt-3 pt-3 border-t border-warm-border flex items-center justify-between">
                  <span className="text-xs text-ink-light">Auto-saves while you type</span>
                  <button onClick={() => saveNote()} className="btn-primary text-sm py-1.5 px-4">Save Now</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
