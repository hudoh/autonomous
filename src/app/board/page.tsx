'use client'

import { useEffect, useState } from 'react'
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

export default function Board() {
  const [decisions, setDecisions] = useState<BoardDecision[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check password when it changes
  useEffect(() => {
    const validPassword = process.env.NEXT_PUBLIC_BOARD_PASSWORD || 'board_password'
    if (!password) {
      setAuthError('')
      setIsAuthenticated(false)
      return
    }
    if (password === validPassword) {
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Incorrect password. Please try again.')
      setIsAuthenticated(false)
    }
  }, [password])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pending board decisions
        const { data: decisionData, error: decisionError } = await supabase
          .from('board_decisions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
        
        if (decisionError) throw decisionError
        
        // Fetch all products for displaying
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('id, name')
        
        if (productError) throw productError
        
        setDecisions(decisionData || [])
        setProducts(productData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleApprove = async (decisionId: string) => {
    try {
      const { error } = await supabase
        .from('board_decisions')
        .update({
          status: 'approved',
          outcome: 'approved'
        })
        .eq('id', decisionId)
      
      if (error) throw error
      
      // Refresh the list
      const { data, error: refreshError } = await supabase
        .from('board_decisions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (refreshError) throw refreshError
      
      setDecisions(data || [])
    } catch (error) {
      console.error('Error approving decision:', error)
      alert('Failed to approve decision')
    }
  }

  const handleReject = async (decisionId: string) => {
    try {
      const { error } = await supabase
        .from('board_decisions')
        .update({
          status: 'rejected',
          outcome: 'rejected'
        })
        .eq('id', decisionId)
      
      if (error) throw error
      
      // Refresh the list
      const { data, error: refreshError } = await supabase
        .from('board_decisions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (refreshError) throw refreshError
      
      setDecisions(data || [])
    } catch (error) {
      console.error('Error rejecting decision:', error)
      alert('Failed to reject decision')
    }
  }

  const getProductById = (id: string) => {
    return products.find(product => product.id === id)
  }

  if (loading) {
    return <div className="p-8">Loading board...</div>
  }

  // Simple authentication - in real app would be more robust
  if (!isAuthenticated) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Board Access</h1>
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          {authError && <p className="text-red-600 mb-4">{authError}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter board password"
            className="w-full px-3 py-2 border rounded-md mb-4"
            autoFocus
          />

        </div>
      </div>
    )
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
                  <h2 className="text-xl font-semibold">Decision for {product?.name || 'Unknown Product'}</h2>
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
      
      {/* Decision History */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Decision History</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* For demo purposes we'll just show one */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Demo Product</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Launch Product</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                    Approved
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-04-09</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}