import Link from 'next/link'
import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

interface MarketListItem {
  id: number
  name: string
  code: string
  updatedAt: string
}

const getMarketsQuery = cache(async (): Promise<MarketListItem[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'markets',
    limit: 100,
    sort: '-createdAt',
    overrideAccess: true, // Allow public access for the markets list
  })

  return result.docs.map((market) => ({
    id: market.id,
    name: market.name,
    code: market.code,
    updatedAt: market.updatedAt,
  }))
})

async function getMarkets(): Promise<MarketListItem[]> {
  try {
    return await getMarketsQuery()
  } catch (error) {
    console.error('Error fetching markets:', error)
    return []
  }
}

export default async function MarketsPage() {
  const markets = await getMarkets()

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Available Markets</h1>
          <p className="text-xl text-gray-600">Select a market to view its features and content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {markets.map((market) => (
            <Link
              key={market.id}
              href={`/market/${market.code}`}
              className="block bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {market.code === 'MY' && '🇲🇾'}
                  {market.code === 'SG' && '🇸🇬'}
                  {market.code === 'AU' && '🇦🇺'}
                </div>
                <h2 className="text-2xl font-bold mb-2">{market.name}</h2>
                <p className="text-gray-500 text-sm mb-4">Code: {market.code}</p>
                <div className="text-blue-600 font-semibold">View Details →</div>
              </div>
            </Link>
          ))}
        </div>

        {markets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No markets available at the moment.</p>
            <p className="text-gray-400 mt-2">
              Please check back later or contact the administrator.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Markets - Multi Market App',
  description: 'Browse all available markets and their features',
}
