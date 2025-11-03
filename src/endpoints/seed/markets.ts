import type { Market } from '@/payload-types'

export interface SeedMarketParams {
  malaysiaLogo?: any
  singaporeLogo?: any
  australiaLogo?: any
  bannerImage?: any
}

export function getSeedMarkets(params: SeedMarketParams): Partial<Market>[] {
  const { malaysiaLogo, singaporeLogo, australiaLogo, bannerImage } = params

  return [
    {
      name: 'Malaysia',
      code: 'MY',
      isDefault: true,
      headerType: 'custom',
      customLogo: malaysiaLogo?.id || null,
      customNavItems: [
        { label: 'Home', url: '/' },
        { label: 'Products', url: '/products' },
        { label: 'Contact', url: '/contact' },
      ],
      ctaButton: {
        label: 'Sign Up',
        url: '/signup',
      },
      footerType: 'custom',
      customFooterLinks: [
        { label: 'About', url: '/about' },
        { label: 'Careers', url: '/careers' },
        { label: 'Privacy', url: '/privacy' },
      ],
      socialMedia: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
      },
      contactInfo: 'contact@malaysia.example.com',
      bannerType: 'custom',
      customBannerMedia: bannerImage?.id || null,
      customBannerHeadline: 'Mega Sale – Shop Now',
      customBannerButton: {
        label: 'Shop Now',
        url: '/shop',
      },
      howItWorksType: 'custom',
      customSteps: [
        {
          icon: '👤',
          title: 'Sign Up',
          description: 'Create your account in seconds with just your email.',
        },
        {
          icon: '📦',
          title: 'Select Plan',
          description: 'Choose the perfect plan that suits your needs.',
        },
        {
          icon: '✨',
          title: 'Get Started',
          description: 'Start exploring all the amazing features.',
        },
      ],
    },
    {
      name: 'Singapore',
      code: 'SG',
      isDefault: false,
      headerType: 'reuse',
      reusedHeader: null, // Will be set to Malaysia's ID during seeding
      overrideLogo: singaporeLogo?.id || null,
      footerType: 'custom',
      customFooterLinks: [
        { label: 'About', url: '/about' },
        { label: 'Careers', url: '/careers' },
        { label: 'Privacy', url: '/privacy' },
      ],
      socialMedia: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
      },
      contactInfo: 'contact@singapore.example.com',
      bannerType: 'reuse',
      reusedBanner: null, // Will be set to Malaysia's ID during seeding
      overrideBannerButton: {
        label: 'Buy Now',
        url: '/buy',
      },
      howItWorksType: 'reuse',
      reusedHowItWorks: null, // Will be set to Malaysia's ID during seeding
    },
    {
      name: 'Australia',
      code: 'AU',
      isDefault: false,
      headerType: 'custom',
      customLogo: australiaLogo?.id || null,
      customNavItems: [
        { label: 'Home', url: '/' },
        { label: 'Products', url: '/products' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ],
      ctaButton: {
        label: 'Get Started',
        url: '/get-started',
      },
      footerType: 'reuse',
      reusedFooter: null, // Will be set to Singapore's ID during seeding
      additionalFooterLinks: [
        { label: 'Made in Australia', url: '/made-in-australia' },
      ],
      bannerType: 'custom',
      customBannerMedia: bannerImage?.id || null,
      customBannerHeadline: 'Welcome to Australia - Experience Excellence',
      customBannerButton: {
        label: 'Explore Now',
        url: '/explore',
      },
      howItWorksType: 'reuse',
      reusedHowItWorks: null, // Will be set to Malaysia's ID during seeding
      extendedSteps: [
        {
          stepIndex: 1,
          video: bannerImage?.id || null, // Using bannerImage as placeholder for video
        },
      ],
    },
  ]
}

