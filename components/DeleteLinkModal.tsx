import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type PaymentLink = {
  id: string
  user_id: string
  type: string
  product_id: string | null
  name: string
  description: string
  link: string
  status: string
  amount: number
  is_flexible_amount: boolean
  currency: string
  payment_limit: number | null
  clicks: number
  created_at: string
  expires_at: string | null
  redirect_url: string | null
  enable_notifications: boolean
  sales: number
  amount_sold: number | null
}

interface DeleteLinkModalProps {
  isOpen: boolean
  onClose: () => void
  link: PaymentLink | null
  onSuccess: (linkId: string) => void
}

export function DeleteLinkModal({ isOpen, onClose, link, onSuccess }: DeleteLinkModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  const handleDelete = async () => {
    if (!link) return
    
    setIsDeleting(true)
    setDeleteError(null)
    
    try {
      const response = await fetch('/api/links/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          link_id: link.id
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Call the success callback with the deleted link ID
        onSuccess(link.id)
        onClose()
      } else {
        setDeleteError(result.error || 'Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      setDeleteError('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !link) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Delete Link</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {deleteError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {deleteError}
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-gray-700">
              Are you sure you want to delete this link?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. All data associated with this link will be permanently removed.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="font-medium text-gray-900">{link.name}</p>
            <p className="text-sm text-gray-500 mt-1">{link.description || 'No description'}</p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 