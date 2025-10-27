/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastNotificationProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([])

  useEffect(() => {
    setVisibleToasts(toasts)
  }, [toasts])

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
    }
  }

  const handleDismiss = (id: string) => {
    setVisibleToasts(prev => prev.filter(toast => toast.id !== id))
    setTimeout(() => onDismiss(id), 300)
  }

  // Auto-dismiss toasts after duration
  useEffect(() => {
    visibleToasts.forEach(toast => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          handleDismiss(toast.id)
        }, toast.duration || 5000)

        return () => clearTimeout(timer)
      }
    })
  }, [visibleToasts, handleDismiss])

  if (visibleToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-lg transition-all duration-300 transform ${
            getToastStyles(toast.type)
          } animate-in slide-in-from-right-full`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationDuration: '300ms'
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{getToastIcon(toast.type)}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{toast.title}</h4>
              <p className="text-sm mt-1 opacity-90">{toast.message}</p>

              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => handleDismiss(toast.id)}
              className="flex-shrink-0 text-lg opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Toast Provider Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action })
  }

  const showError = (title: string, message: string, action?: Toast['action']) => {
    addToast({ type: 'error', title, message, action, duration: 0 }) // Don't auto-dismiss errors
  }

  const showWarning = (title: string, message: string, action?: Toast['action']) => {
    addToast({ type: 'warning', title, message, action })
  }

  const showInfo = (title: string, message: string, action?: Toast['action']) => {
    addToast({ type: 'info', title, message, action })
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer: () => <ToastNotification toasts={toasts} onDismiss={removeToast} />
  }
}