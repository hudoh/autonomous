'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  slug: string
  problem_brief: string
  market_size: string
  icp: string
  pricing: string
  status: string
}

export default function ProductBrief({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [problemBrief, setProblemBrief] = useState('')
  const [marketSize, setMarketSize] = useState('')
  const [icp, setIcp] = useState('')
  const [pricing, setPricing] = useState('')
  const [status, setStatus] = useState('researching')
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (error) throw error
        
        if (data) {
          setProduct(data)
          setProblemBrief(data.problem_brief)
          setMarketSize(data.market_size)
          setIcp(data.icp)
          setPricing(data.pricing)
          setStatus(data.status)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          problem_brief: problemBrief,
          market_size: marketSize,
          icp: icp,
          pricing: pricing,
          status: status
        })
        .eq('id', params.id)
      
      if (error) throw error
      
      // Show success message or redirect
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  if (loading) {
    return <div className="p-8">Loading product...</div>
  }

  if (!product) {
    return <div className="p-8">Product not found</div>
  }

  const getStatusOptions = () => {
    return [
      { value: 'researching', label: 'Researching' },
      { value: 'developing', label: 'Developing' },
      { value: 'testing', label: 'Testing' },
      { value: 'launching', label: 'Launching' },
      { value: 'live', label: 'Live' }
    ]
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{product.name} - Product Brief</h1>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          value={product.name}
          readOnly
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          type="text"
          value={product.slug}
          readOnly
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
        <textarea
          value={problemBrief}
          onChange={(e) => setProblemBrief(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Market Size</label>
        <textarea
          value={marketSize}
          onChange={(e) => setMarketSize(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ideal Customer Profile (ICP)</label>
        <textarea
          value={icp}
          onChange={(e) => setIcp(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pricing</label>
        <textarea
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          {getStatusOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
      
      {/* Activity Feed */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <p className="text-gray-600">No activity yet</p>
        </div>
      </div>
    </div>
  )
}