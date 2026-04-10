'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface BoardDecision {
  id: string
  product_id: string
  decision: string
  rationale: string
  status: string
  outcome: string | null
  created_at: string
}

interface Product {
  id: string
  name: string
}

const BOARD_PASSWORD = 'board_password'

export default function Board() {
  const [decisions, setDecisions] = useState<BoardDecision[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const entered = passwordInput.trim()
    if (entered === BOARD_PASSWORD) {
      setAuthenticated(true)
      setLoading(true)
      await fetchData()
    } else {
      setError('Incorrect password')
    }
  }

  const fetchData = async () => {
    try {
      const [decisionsRes, productsRes] = await Promise.all([
        supabase.from('board_decisions').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('id, name')
      ])
      
      if (decisionsRes.error) throw decisionsRes.error
      if (productsRes.error) throw productsRes.error
      
      setDecisions(decisionsRes.data || [])
      setProducts(productsRes.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (decisionId: string) => {
    try {
      const { error } = await supabase
        .from('board_decisions')
        .update({ status: 'approved', outcome: 'approved' })
        .eq('id', decisionId)
      
      if (error) throw error
      
      setDecisions(prev => prev.filter(d => d.id !== decisionId))
    } catch (err) {
      console.error('Error approving:', err)
      alert('Failed to approve')
    }
  }

  const handleReject = async (decisionId: string) => {
    try {
      const { error } = await supabase
        .from('board_decisions')
        .update({ status: 'rejected', outcome: 'rejected' })
        .eq('id', decisionId)
      
      if (error) throw error
      
      setDecisions(prev => prev.filter(d => d.id !== decisionId))
    } catch (err) {
      console.error('Error rejecting:', err)
      alert('Failed to reject')
    }
  }

  const getProductById = (id: string) => products.find(p => p.id === id)

  if (!authenticated) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Board Access</h1>
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <form onSubmit={handlePasswordSubmit}>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Enter board password"
              className="w-full px-3 py-2 border rounded-md mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-[#0f2942] text-white px-4 py-2 rounded hover:bg-[#1a3b5d]"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="p-8">Loading board...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Board Decisions</h1>
      
      {decisions.length > 0 ? (
        <div className="space-y-6">
          {decisions.map((decision) => {
            const product = getProductById(decision.product_id)
            return (
              <div key={decision.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">
                    {product?.name || 'Unknown Product'}
                  </h2>
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                    Pending
                  </span>
                </div>
                <p className="mb-2"><span className="font-medium">Decision:</span> {decision.decision}</p>
                <p className="mb-4"><span className="font-medium">Rationale:</span> {decision.rationale}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(decision.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(decision.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border rounded-lg p-8 bg-white shadow-sm text-center">
          <p className="text-gray-600">No pending decisions</p>
        </div>
      )}
    </div>
  )
}
