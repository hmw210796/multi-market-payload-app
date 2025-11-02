import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface MarketData {
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

async function getMarketData(code: string): Promise<MarketData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/markets/${code}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching market data:', error)
    return null
  }
}

type Args = {
  params: Promise<{
    code: string
  }>
}

export default async function MarketPage({ params: paramsPromise }: Args) {
  const { code } = await paramsPromise
  const marketData = await getMarketData(code)

  // console.log(marketData)

  if (!marketData) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      {/* Banner Section */}
      {marketData.banner.headline && (
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            {marketData.banner.media && (
              <div className="mb-8">
                <img
                  src={marketData.banner.media}
                  alt={marketData.banner.headline}
                  className="w-full max-w-4xl mx-auto rounded-lg shadow-xl"
                />
              </div>
            )}
            <h1 className="text-5xl font-bold mb-6">{marketData.banner.headline}</h1>
            {marketData.banner.button && (
              <a
                href={marketData.banner.button.url}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                {marketData.banner.button.label}
              </a>
            )}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      {marketData.howItWorks.steps.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {marketData.howItWorks.steps.map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  {step.icon && <div className="text-5xl mb-4 text-center">{step.icon}</div>}
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  {step.video && (
                    <div className="mt-4">
                      <video src={step.video} controls className="w-full rounded-lg">
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{marketData.name}</h3>
              {marketData.footer.contactInfo && (
                <p className="text-gray-400">{marketData.footer.contactInfo}</p>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {marketData.footer.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {marketData.footer.socialMedia && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {marketData.footer.socialMedia.facebook && (
                    <a
                      href={marketData.footer.socialMedia.facebook}
                      className="text-gray-400 hover:text-white"
                    >
                      Facebook
                    </a>
                  )}
                  {marketData.footer.socialMedia.twitter && (
                    <a
                      href={marketData.footer.socialMedia.twitter}
                      className="text-gray-400 hover:text-white"
                    >
                      Twitter
                    </a>
                  )}
                  {marketData.footer.socialMedia.instagram && (
                    <a
                      href={marketData.footer.socialMedia.instagram}
                      className="text-gray-400 hover:text-white"
                    >
                      Instagram
                    </a>
                  )}
                  {marketData.footer.socialMedia.linkedin && (
                    <a
                      href={marketData.footer.socialMedia.linkedin}
                      className="text-gray-400 hover:text-white"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {marketData.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { code } = await paramsPromise
  const marketData = await getMarketData(code)

  if (!marketData) {
    return {
      title: 'Market Not Found',
    }
  }

  return {
    title: `${marketData.name} - Market`,
    description: `Explore ${marketData.name} market features and services.`,
  }
}
