'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
}

interface BoardDecision {
  id: string
  product_id: string
  decision: string
  rationale: string
  status: string
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [waitlistCounts, setWaitlistCounts] = useState<Record<string, number>>({})
  const [pendingDecisions, setPendingDecisions] = useState<BoardDecision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
        
        if (productsError) throw productsError
        
        // Fetch all waitlist entries
        const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlist')
          .select('product_id')
        
        if (waitlistError) throw waitlistError
        
        // Count waitlist entries by product_id
        const counts: Record<string, number> = {}
        if (waitlistData) {
          waitlistData.forEach((item) => {
            counts[item.product_id] = (counts[item.product_id] || 0) + 1
          })
        }
        
        // Fetch pending board decisions
        const { data: decisionData, error: decisionError } = await supabase
          .from('board_decisions')
          .select('*')
          .eq('status', 'pending')
        
        if (decisionError) throw decisionError
        
        setProducts(productsData || [])
        setWaitlistCounts(counts)
        setPendingDecisions(decisionData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">AUTONOMOUS Dashboard</h1>
      
      {/* Products Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-600 mb-2">Status: {product.status}</p>
              <p className="text-gray-600 mb-2">Waitlist: {waitlistCounts[product.id] || 0} signups</p>
              <button className="text-blue-600 hover:underline">View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist Totals */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Waitlist Totals</h2>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Signups</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(waitlistCounts).map(([productId, count]) => {
                const product = products.find(p => p.id === productId)
                return (
                  <tr key={productId}>
                    <td className="px-6 py-4 whitespace-nowrap">{product?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{count}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Build Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Build Status</h2>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <p className="text-gray-600">All systems operational</p>
        </div>
      </div>

      {/* Board Decisions Pending */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Board Decisions Pending</h2>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          {pendingDecisions.length > 0 ? (
            <ul className="space-y-2">
              {pendingDecisions.map((decision) => {
                const product = products.find(p => p.id === decision.product_id)
                return (
                  <li key={decision.id} className="border-b pb-2">
                    <p><span className="font-semibold">Product:</span> {product?.name || 'Unknown'}</p>
                    <p><span className="font-semibold">Decision:</span> {decision.decision}</p>
                    <p><span className="font-semibold">Rationale:</span> {decision.rationale}</p>
                    <div className="flex space-x-2 mt-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>No pending decisions</p>
          )}
        </div>
      </div>
    </div>
  )
}