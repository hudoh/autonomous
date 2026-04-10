import { supabase } from '@/lib/supabase'

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

export default async function ProductLanding({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  let data: Product | null = null
  let fetchError = false
  let errorMessage = ''
  
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.error('[DEBUG] env vars:', url ? 'URL present' : 'URL MISSING', key ? 'KEY present' : 'KEY MISSING')
    
    const result = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    console.error('[DEBUG] supabase result:', JSON.stringify(result))
    data = result.data as Product | null
  } catch (e: any) {
    fetchError = true
    errorMessage = e?.message || String(e)
    console.error('[DEBUG] fetch error:', errorMessage)
  }
  
  if (fetchError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {data.problem_brief || 'We are working hard to bring you the best solution for this problem.'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Join the Waitlist</h3>
          <p className="text-gray-600 mb-6">
            Be the first to know when we launch. Enter your email below.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Join Waitlist
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Problem Statement</h3>
            <p className="text-gray-600">
              {data.problem_brief || 'No problem statement available.'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Size</h3>
            <p className="text-gray-600">
              {data.market_size || 'Market size information not yet available.'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ideal Customer Profile</h3>
            <p className="text-gray-600">
              {data.icp || 'No ICP information available.'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h3>
            <p className="text-gray-600">
              {data.pricing || 'Pricing information not yet available.'}
            </p>
          </div>
        </div>

        <div className="text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            data.status === 'researching' ? 'bg-gray-200 text-gray-800' :
            data.status === 'developing' ? 'bg-blue-200 text-blue-800' :
            data.status === 'testing' ? 'bg-yellow-200 text-yellow-800' :
            data.status === 'launching' ? 'bg-purple-200 text-purple-800' :
            data.status === 'live' ? 'bg-green-200 text-green-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            Status: {data.status}
          </span>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} AUTONOMOUS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
