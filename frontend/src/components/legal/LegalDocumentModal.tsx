import { X, FileText, Shield } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface LegalDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document: 'terms' | 'privacy'
  content: string
  onAccept?: () => void
  requiresAcceptance?: boolean
}

const LegalDocumentModal = ({
  isOpen,
  onClose,
  document,
  content,
  onAccept,
  requiresAcceptance = false
}: LegalDocumentModalProps) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

  if (!isOpen) return null

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const scrolledToBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50 // 50px threshold

    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const handleAccept = () => {
    if (onAccept) {
      onAccept()
    }
    onClose()
  }

  const Icon = document === 'terms' ? FileText : Shield
  const title = document === 'terms' ? 'Terms of Service' : 'Privacy Policy'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={requiresAcceptance ? undefined : onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#1C3D6E] to-[#3DAEDB] text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sm text-white/80">Taji Fanisi Development Network</p>
              </div>
            </div>
            {!requiresAcceptance && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Scroll Indicator */}
          {requiresAcceptance && !hasScrolledToBottom && (
            <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Please scroll to the bottom to read the entire document before accepting
              </p>
            </div>
          )}

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto p-6 prose prose-sm max-w-none"
            onScroll={handleScroll}
            style={{
              scrollBehavior: 'smooth'
            }}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-[#1C3D6E] mb-4 mt-6 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-[#1C3D6E] mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-[#2C857A] mb-2 mt-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="ml-4">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#1C3D6E]">
                    {children}
                  </strong>
                ),
                hr: () => (
                  <hr className="my-6 border-gray-300" />
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#3DAEDB] pl-4 italic my-4 text-gray-600">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            {requiresAcceptance ? (
              <>
                <p className="text-sm text-gray-600">
                  {hasScrolledToBottom
                    ? 'You have reviewed the document'
                    : 'Scroll to the bottom to accept'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={!hasScrolledToBottom}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      hasScrolledToBottom
                        ? 'bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    I Accept
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Last updated: October 28, 2025
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] text-white font-medium hover:shadow-lg transition-shadow"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalDocumentModal
