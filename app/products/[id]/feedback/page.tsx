'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FeedbackEntry {
  id: string
  email: string | null
  feedback: string
  sentiment: string
  created_at: string
}

export default function ProductFeedback({ params }: { params: { id: string } }) {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sentimentFilter, setSentimentFilter] = useState('all')

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        let query = supabase
          .from('feedback')
          .select('*')
          .eq('product_id', params.id)
          .order('created_at', { ascending: false })
        
        if (sentimentFilter !== 'all') {
          query = query.eq('sentiment', sentimentFilter)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        setFeedback(data || [])
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [params.id, sentimentFilter])

  const getSentimentBadge = (sentiment: string) => {
    let badgeClass = ''
    
    switch (sentiment) {
      case 'positive':
        badgeClass = 'bg-green-200 text-green-800'
        break
      case 'neutral':
        badgeClass = 'bg-gray-200 text-gray-800'
        break
      case 'negative':
        badgeClass = 'bg-red-200 text-red-800'
        break
      default:
        badgeClass = 'bg-gray-200 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {sentiment}
      </span>
    )
  }

  const getSentimentCounts = () => {
    const counts = { positive: 0, neutral: 0, negative: 0 }
    
    feedback.forEach(entry => {
      if (entry.sentiment === 'positive') counts.positive++
      else if (entry.sentiment === 'neutral') counts.neutral++
      else if (entry.sentiment === 'negative') counts.negative++
    })
    
    return counts
  }

  const sentimentCounts = getSentimentCounts()

  if (loading) {
    return <div className="p-8">Loading feedback...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Feedback Management</h1>
      
      {/* Sentiment Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feedback Summary</h2>
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</p>
            <p className="text-sm text-gray-600">Positive</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{sentimentCounts.neutral}</p>
            <p className="text-sm text-gray-600">Neutral</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</p>
            <p className="text-sm text-gray-600">Negative</p>
          </div>
        </div>
      </div>
      
      {/* Sentiment Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Sentiment</label>
        <div className="flex space-x-4">
          <button
            onClick={() => setSentimentFilter('all')}
            className={`px-4 py-2 rounded ${sentimentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setSentimentFilter('positive')}
            className={`px-4 py-2 rounded ${sentimentFilter === 'positive' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Positive
          </button>
          <button
            onClick={() => setSentimentFilter('neutral')}
            className={`px-4 py-2 rounded ${sentimentFilter === 'neutral' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
          >
            Neutral
          </button>
          <button
            onClick={() => setSentimentFilter('negative')}
            className={`px-4 py-2 rounded ${sentimentFilter === 'negative' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Negative
          </button>
        </div>
      </div>
      
      {/* Feedback List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feedback Entries</h2>
        
        {feedback.length > 0 ? (
          <div className="space-y-4">
            {feedback.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{entry.email || 'Anonymous'}</span>
                  {getSentimentBadge(entry.sentiment)}
                </div>
                <p className="text-gray-700 mb-2">{entry.feedback}</p>
                <p className="text-sm text-gray-500">
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No feedback yet</p>
        )}
      </div>
      
      {/* Trend Chart Placeholder */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feedback Trend</h2>
        <div className="border rounded-lg p-8 bg-white shadow-sm text-center">
          <p className="text-gray-600">Feedback trend chart would appear here</p>
        </div>
      </div>
    </div>
  )
}