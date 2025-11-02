import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get all markets
    const { docs: markets } = await payload.find({
      collection: 'markets',
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      data: markets.map((market) => ({
        id: market.id,
        name: market.name,
        code: market.code,
        updatedAt: market.updatedAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching markets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

