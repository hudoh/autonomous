'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface WaitlistEntry {
  id: string
  email: string
  source: string
  created_at: string
}

export default function ProductWaitlist({ params }: { params: { id: string } }) {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('direct')

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist')
          .select('*')
          .eq('product_id', params.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setWaitlist(data || [])
      } catch (error) {
        console.error('Error fetching waitlist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWaitlist()
  }, [params.id])

  const handleAddToWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          product_id: params.id,
          email: email,
          source: source
        })
      
      if (error) throw error
      
      // Refresh the list
      const { data, error: refreshError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('product_id', params.id)
        .order('created_at', { ascending: false })
      
      if (refreshError) throw refreshError
      
      setWaitlist(data || [])
      setEmail('')
      
      alert('Successfully added to waitlist!')
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      alert('Failed to add to waitlist')
    }
  }

  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "Email,Source,Date\n"
    
    waitlist.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleDateString()
      csvContent += `"${entry.email}","${entry.source}","${date}"\n`
    })
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `waitlist-${params.id}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <div className="p-8">Loading waitlist...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Waitlist Management</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add to Waitlist</h2>
        <form onSubmit={handleAddToWaitlist} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="direct">Direct</option>
              <option value="social">Social Media</option>
              <option value="referral">Referral</option>
              <option value="marketing">Marketing Campaign</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add to Waitlist
          </button>
        </form>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Waitlist Signups</h2>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">Total: {waitlist.length} signups</p>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waitlist.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}