import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Market } from '@/payload-types'

interface ResolvedMarketData {
  name: string
  code: string
  header: {
    logo?: string
    navItems: Array<{ label: string; url: string }>
    ctaButton?: { label: string; url: string }
  }
  footer: {
    links: Array<{ label: string; url: string }>
    socialMedia?: Record<string, string>
    contactInfo?: string
  }
  banner: {
    media?: string
    headline?: string
    button?: { label: string; url: string }
  }
  howItWorks: {
    steps: Array<{
      icon?: string
      title: string
      description: string
      video?: string
    }>
  }
}

/**
 * Resolves a market's data by following reuse relationships
 */
async function resolveMarketData(market: Market, payload: any): Promise<ResolvedMarketData> {
  const resolved: ResolvedMarketData = {
    name: market.name,
    code: market.code,
    header: { navItems: [] },
    footer: { links: [] },
    banner: {},
    howItWorks: { steps: [] },
  }

  // Resolve Header
  if (market.headerType === 'custom') {
    // Custom header
    if (typeof market.customLogo === 'object' && market.customLogo?.url) {
      resolved.header.logo = market.customLogo.url
    }

    if (Array.isArray(market.customNavItems)) {
      resolved.header.navItems = market.customNavItems.map((item: any) => ({
        label: item.label,
        url: item.url,
      }))
    }

    if (market.ctaButton?.label && market.ctaButton?.url) {
      resolved.header.ctaButton = {
        label: market.ctaButton.label,
        url: market.ctaButton.url,
      }
    }
  } else if (
    market.headerType === 'reuse' &&
    typeof market.reusedHeader === 'object' &&
    market.reusedHeader !== null
  ) {
    // Reuse from another market
    const { docs } = await payload.find({
      collection: 'markets',
      where: {
        id: {
          equals: market.reusedHeader.id,
        },
      },
      limit: 1,
    })

    if (docs.length > 0) {
      const sourceMarket = docs[0] as Market
      const sourceHeader = await resolveMarketHeader(sourceMarket, payload)
      resolved.header = sourceHeader

      // Apply overrides if specified
      if (market.customLogo) {
        if (typeof market.customLogo === 'object' && market.customLogo?.url) {
          resolved.header.logo = market.customLogo.url
        }
      }
    }
  }

  // Resolve Footer
  if (market.footerType === 'custom') {
    // Custom footer
    if (Array.isArray(market.customFooterLinks)) {
      resolved.footer.links = market.customFooterLinks.map((item: any) => ({
        label: item.label,
        url: item.url,
      }))
    }

    if (typeof market.socialMedia === 'object') {
      resolved.footer.socialMedia = {
        facebook: market.socialMedia?.facebook || '',
        twitter: market.socialMedia?.twitter || '',
        instagram: market.socialMedia?.instagram || '',
        linkedin: market.socialMedia?.linkedin || '',
      }
    }

    if (market.contactInfo) {
      resolved.footer.contactInfo = market.contactInfo
    }
  } else if (
    market.footerType === 'reuse' &&
    typeof market.reusedFooter === 'object' &&
    market.reusedFooter !== null
  ) {
    // Reuse from another market
    const { docs } = await payload.find({
      collection: 'markets',
      where: {
        id: {
          equals: market.reusedFooter.id,
        },
      },
      limit: 1,
    })

    if (docs.length > 0) {
      const sourceMarket = docs[0] as Market
      const sourceFooter = await resolveMarketFooter(sourceMarket, payload)
      resolved.footer = sourceFooter
    }
  }

  // Add additional footer links if any
  if (Array.isArray(market.additionalFooterLinks) && market.additionalFooterLinks.length > 0) {
    const additionalLinks = market.additionalFooterLinks.map((item: any) => ({
      label: item.label,
      url: item.url,
    }))
    resolved.footer.links = [...resolved.footer.links, ...additionalLinks]
  }

  // Resolve Banner
  if (market.bannerType === 'custom') {
    // Custom banner
    if (typeof market.customBannerMedia === 'object' && market.customBannerMedia?.url) {
      resolved.banner.media = market.customBannerMedia.url
    }
    resolved.banner.headline = market.customBannerHeadline || ''
    if (market.customBannerButton?.label && market.customBannerButton?.url) {
      resolved.banner.button = {
        label: market.customBannerButton.label,
        url: market.customBannerButton.url,
      }
    }
  } else if (
    market.bannerType === 'reuse' &&
    typeof market.reusedBanner === 'object' &&
    market.reusedBanner !== null
  ) {
    // Copy from another market
    const { docs } = await payload.find({
      collection: 'markets',
      where: {
        id: {
          equals: market.reusedBanner.id,
        },
      },
      limit: 1,
    })

    if (docs.length > 0) {
      const sourceMarket = docs[0] as Market
      const sourceBanner = await resolveMarketBanner(sourceMarket, payload)
      resolved.banner = { ...sourceBanner }

      // Apply overrides if specified
      if (market.overrideBannerButton?.label && market.overrideBannerButton?.url) {
        resolved.banner.button = {
          label: market.overrideBannerButton.label,
          url: market.overrideBannerButton.url,
        }
      }
    }
  }

  // Resolve How It Works
  if (market.howItWorksType === 'custom') {
    // Custom steps
    if (Array.isArray(market.customSteps)) {
      resolved.howItWorks.steps = market.customSteps.map((step: any) => ({
        icon: step.icon || '',
        title: step.title,
        description: step.description,
        video: typeof step.video === 'object' && step.video?.url ? step.video.url : undefined,
      }))
    }
  } else if (
    market.howItWorksType === 'reuse' &&
    typeof market.reusedHowItWorks === 'object' &&
    market.reusedHowItWorks !== null
  ) {
    // Reuse from another market
    const { docs } = await payload.find({
      collection: 'markets',
      where: {
        id: {
          equals: market.reusedHowItWorks.id,
        },
      },
      limit: 1,
    })

    if (docs.length > 0) {
      const sourceMarket = docs[0] as Market
      const sourceHowItWorks = await resolveMarketHowItWorks(sourceMarket, payload)
      resolved.howItWorks = { ...sourceHowItWorks }

      // Apply extensions if any
      if (Array.isArray(market.extendedSteps)) {
        market.extendedSteps.forEach((extension: any) => {
          const stepIndex = extension.stepIndex
          if (
            stepIndex >= 0 &&
            stepIndex < resolved.howItWorks.steps.length &&
            typeof extension.video === 'object' &&
            extension.video?.url
          ) {
            resolved.howItWorks.steps[stepIndex].video = extension.video.url
          }
        })
      }
    }
  }

  return resolved
}

async function resolveMarketHeader(
  market: Market,
  payload: any,
): Promise<ResolvedMarketData['header']> {
  let header: ResolvedMarketData['header'] = { navItems: [] }

  if (market.headerType === 'custom') {
    if (typeof market.customLogo === 'object' && market.customLogo?.url) {
      header.logo = market.customLogo.url
    }
    if (Array.isArray(market.customNavItems)) {
      header.navItems = market.customNavItems.map((item: any) => ({
        label: item.label,
        url: item.url,
      }))
    }
    if (market.ctaButton?.label && market.ctaButton?.url) {
      header.ctaButton = {
        label: market.ctaButton.label,
        url: market.ctaButton.url,
      }
    }
  } else if (
    market.headerType === 'reuse' &&
    typeof market.reusedHeader === 'object' &&
    market.reusedHeader !== null
  ) {
    const { docs } = await payload.find({
      collection: 'markets',
      where: { id: { equals: market.reusedHeader.id } },
      limit: 1,
    })
    if (docs.length > 0) {
      header = await resolveMarketHeader(docs[0] as Market, payload)
    }
  }

  return header
}

async function resolveMarketFooter(
  market: Market,
  payload: any,
): Promise<ResolvedMarketData['footer']> {
  let footer: ResolvedMarketData['footer'] = { links: [] }

  if (market.footerType === 'custom') {
    if (Array.isArray(market.customFooterLinks)) {
      footer.links = market.customFooterLinks.map((item: any) => ({
        label: item.label,
        url: item.url,
      }))
    }
    if (typeof market.socialMedia === 'object') {
      footer.socialMedia = {
        facebook: market.socialMedia?.facebook || '',
        twitter: market.socialMedia?.twitter || '',
        instagram: market.socialMedia?.instagram || '',
        linkedin: market.socialMedia?.linkedin || '',
      }
    }
    footer.contactInfo = market.contactInfo || undefined
  } else if (
    market.footerType === 'reuse' &&
    typeof market.reusedFooter === 'object' &&
    market.reusedFooter !== null
  ) {
    const { docs } = await payload.find({
      collection: 'markets',
      where: { id: { equals: market.reusedFooter.id } },
      limit: 1,
    })
    if (docs.length > 0) {
      footer = await resolveMarketFooter(docs[0] as Market, payload)
    }
  }

  return footer
}

async function resolveMarketBanner(
  market: Market,
  payload: any,
): Promise<ResolvedMarketData['banner']> {
  let banner: ResolvedMarketData['banner'] = {}

  if (market.bannerType === 'custom') {
    if (typeof market.customBannerMedia === 'object' && market.customBannerMedia?.url) {
      banner.media = market.customBannerMedia.url
    }
    banner.headline = market.customBannerHeadline || ''
    if (market.customBannerButton?.label && market.customBannerButton?.url) {
      banner.button = {
        label: market.customBannerButton.label,
        url: market.customBannerButton.url,
      }
    }
  } else if (
    market.bannerType === 'reuse' &&
    typeof market.reusedBanner === 'object' &&
    market.reusedBanner !== null
  ) {
    const { docs } = await payload.find({
      collection: 'markets',
      where: { id: { equals: market.reusedBanner.id } },
      limit: 1,
    })
    if (docs.length > 0) {
      banner = { ...(await resolveMarketBanner(docs[0] as Market, payload)) }
    }
  }

  return banner
}

async function resolveMarketHowItWorks(market: Market, payload: any) {
  const howItWorks: ResolvedMarketData['howItWorks'] = { steps: [] }

  if (market.howItWorksType === 'custom') {
    if (Array.isArray(market.customSteps)) {
      howItWorks.steps = market.customSteps.map((step: any) => ({
        icon: step.icon || '',
        title: step.title,
        description: step.description,
        video: typeof step.video === 'object' && step.video?.url ? step.video.url : undefined,
      }))
    }
  } else if (
    market.howItWorksType === 'reuse' &&
    typeof market.reusedHowItWorks === 'object' &&
    market.reusedHowItWorks !== null
  ) {
    const { docs } = await payload.find({
      collection: 'markets',
      where: { id: { equals: market.reusedHowItWorks.id } },
      limit: 1,
    })
    if (docs.length > 0) {
      howItWorks.steps = (await resolveMarketHowItWorks(docs[0] as Market, payload)).steps
    }
  }

  return howItWorks
}

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { code } = await params

    // Find market by code
    const { docs: markets } = await payload.find({
      collection: 'markets',
      where: {
        code: {
          equals: code.toUpperCase(),
        },
      },
      limit: 1,
    })

    if (markets.length === 0) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 })
    }

    const market = markets[0] as Market
    const resolvedData = await resolveMarketData(market, payload)

    return NextResponse.json({
      success: true,
      data: resolvedData,
    })
  } catch (error) {
    console.error('Error fetching market data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
