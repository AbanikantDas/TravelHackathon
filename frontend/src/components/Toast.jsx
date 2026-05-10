import React, { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  }

  return { toasts, toast }
}

const TYPE_STYLES = {
  success: { bg: 'bg-teal text-white', icon: '✓' },
  error:   { bg: 'bg-red-500 text-white', icon: '✕' },
  info:    { bg: 'bg-terracotta text-white', icon: 'ℹ' },
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const { bg, icon } = TYPE_STYLES[t.type] || TYPE_STYLES.success
        return (
          <div
            key={t.id}
            className={`toast-animate pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-card shadow-float text-sm font-medium min-w-[220px] max-w-xs ${bg}`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs flex-shrink-0">
              {icon}
            </span>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => onClose?.(t.id)} className="opacity-70 hover:opacity-100 ml-1 text-xs">✕</button>
          </div>
        )
      })}
    </div>
  )
}
