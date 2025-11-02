import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Markets: CollectionConfig<'markets'> = {
  slug: 'markets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'updatedAt'],
    description: 'Manage markets for different regions (Malaysia, Singapore, Australia)',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for the market (e.g., Malaysia, Singapore, Australia)',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique code for the market (e.g., MY, SG, AU)',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set this as the default market',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'headerType',
              type: 'select',
              required: true,
              defaultValue: 'reuse',
              admin: {
                description:
                  'Choose whether to create a custom header or reuse from another market',
              },
              options: [
                {
                  label: 'Create Custom Header',
                  value: 'custom',
                },
                {
                  label: 'Reuse from Another Market',
                  value: 'reuse',
                },
              ],
            },
            {
              name: 'reusedHeader',
              type: 'relationship',
              relationTo: 'markets',
              admin: {
                condition: (_, siblingData) => siblingData?.headerType === 'reuse',
                description: 'Select the market whose header to reuse',
              },
            },
            {
              name: 'customLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => siblingData?.headerType === 'custom',
                description: 'Upload market logo/flag',
              },
            },
            {
              name: 'customNavItems',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Link URL',
                  },
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.headerType === 'custom',
                description: 'Custom navigation items',
                initCollapsed: true,
              },
            },
            {
              name: 'ctaButton',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.headerType === 'custom',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.headerType === 'custom',
                  },
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.headerType === 'custom',
              },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerType',
              type: 'select',
              required: true,
              defaultValue: 'reuse',
              admin: {
                description:
                  'Choose whether to create a custom footer or reuse from another market',
              },
              options: [
                {
                  label: 'Create Custom Footer',
                  value: 'custom',
                },
                {
                  label: 'Reuse from Another Market',
                  value: 'reuse',
                },
              ],
            },
            {
              name: 'reusedFooter',
              type: 'relationship',
              relationTo: 'markets',
              admin: {
                condition: (_, siblingData) => siblingData?.footerType === 'reuse',
                description: 'Select the market whose footer to reuse',
              },
            },
            {
              name: 'customFooterLinks',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.footerType === 'custom',
                description: 'Custom footer links',
                initCollapsed: true,
              },
            },
            {
              name: 'socialMedia',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.footerType === 'custom',
              },
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                },
                {
                  name: 'twitter',
                  type: 'text',
                },
                {
                  name: 'instagram',
                  type: 'text',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                },
              ],
            },
            {
              name: 'contactInfo',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.footerType === 'custom',
                description: 'Contact email or phone number',
              },
            },
            {
              name: 'additionalFooterLinks',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.footerType === 'reuse' || siblingData?.footerType === 'custom',
                description: 'Additional footer links (can add to reused footer)',
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: 'Banner',
          fields: [
            {
              name: 'bannerType',
              type: 'select',
              required: true,
              defaultValue: 'reuse',
              admin: {
                description:
                  'Choose whether to create a custom banner or reuse from another market',
              },
              options: [
                {
                  label: 'Create Custom Banner',
                  value: 'custom',
                },
                {
                  label: 'Copy from Another Market',
                  value: 'reuse',
                },
              ],
            },
            {
              name: 'reusedBanner',
              type: 'relationship',
              relationTo: 'markets',
              admin: {
                condition: (_, siblingData) => siblingData?.bannerType === 'reuse',
                description: 'Select the market whose banner to copy',
              },
            },
            {
              name: 'customBannerMedia',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => siblingData?.bannerType === 'custom',
                description: 'Upload banner image or video',
              },
            },
            {
              name: 'customBannerHeadline',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.bannerType === 'custom',
              },
            },
            {
              name: 'customBannerButton',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.bannerType === 'custom',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.bannerType === 'custom',
                  },
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.bannerType === 'custom',
              },
            },
            {
              name: 'overrideBannerButton',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.bannerType === 'reuse',
                    description: 'Override button label when reusing banner',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.bannerType === 'reuse',
                    description: 'Override button URL when reusing banner',
                  },
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.bannerType === 'reuse',
              },
            },
          ],
        },
        {
          label: 'How It Works',
          fields: [
            {
              name: 'howItWorksType',
              type: 'select',
              required: true,
              defaultValue: 'reuse',
              admin: {
                description: 'Choose whether to create custom steps or reuse from another market',
              },
              options: [
                {
                  label: 'Create Custom Steps',
                  value: 'custom',
                },
                {
                  label: 'Reuse from Another Market',
                  value: 'reuse',
                },
              ],
            },
            {
              name: 'reusedHowItWorks',
              type: 'relationship',
              relationTo: 'markets',
              admin: {
                condition: (_, siblingData) => siblingData?.howItWorksType === 'reuse',
                description: 'Select the market whose "How It Works" to reuse',
              },
            },
            {
              name: 'customSteps',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  admin: {
                    description: 'Icon name or emoji (e.g., 👤, 📦, ✨)',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional video to extend this step',
                  },
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.howItWorksType === 'custom',
                description: 'Custom "How It Works" steps',
                initCollapsed: true,
              },
            },
            {
              name: 'extendedSteps',
              type: 'array',
              fields: [
                {
                  name: 'stepIndex',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'Index of the step to extend (0-based)',
                  },
                },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Video to add to this step',
                  },
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.howItWorksType === 'reuse',
                description: 'Extend reused steps with additional fields like videos',
                initCollapsed: true,
              },
            },
          ],
        },
      ],
    },
  ],
}
