'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

interface MarketHeaderData {
  logo?: string
  navItems: Array<{ label: string; url: string }>
  ctaButton?: { label: string; url: string }
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [marketHeaderData, setMarketHeaderData] = useState<MarketHeaderData | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Detect if we're on a market page and fetch market-specific header data
  useEffect(() => {
    const marketMatch = pathname?.match(/^\/market\/([A-Z]+)/i)
    if (marketMatch) {
      const marketCode = marketMatch[1]
      fetch(`/api/markets/${marketCode}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.data?.header) {
            setMarketHeaderData(result.data.header)
          }
        })
        .catch((err) => {
          console.error('Error fetching market header:', err)
        })
    } else {
      setMarketHeaderData(null)
    }
  }, [pathname])

  // Determine which navigation items to use
  const navItemsToUse =
    marketHeaderData && marketHeaderData.navItems.length > 0
      ? marketHeaderData.navItems.map((item) => ({
          link: {
            url: item.url,
            label: item.label,
            type: 'custom' as const,
            newTab: false,
          },
          id: item.url,
        }))
      : data.navItems || []

  // Create header data object with selected nav items
  const headerDataToUse = {
    ...data,
    navItems: navItemsToUse,
  }

  return (
    <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          {marketHeaderData?.logo ? (
            <Image
              src={marketHeaderData.logo}
              alt="Market Logo"
              width={193}
              height={34}
              priority
              className="max-w-[9.375rem] w-full h-[34px]"
            />
          ) : (
            <Logo loading="eager" priority="high" className="invert dark:invert-0" />
          )}
        </Link>
        <div className="flex gap-3 items-center">
          <HeaderNav data={headerDataToUse} />
          {marketHeaderData?.ctaButton && (
            <CMSLink url={marketHeaderData.ctaButton.url} appearance="default" size="lg">
              {marketHeaderData.ctaButton.label}
            </CMSLink>
          )}
        </div>
      </div>
    </header>
  )
}
