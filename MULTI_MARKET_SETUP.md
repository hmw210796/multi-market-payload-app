# Multi-Market / Multi-Brand System Documentation

## Overview

This application implements a sophisticated multi-market system that supports Malaysia, Singapore, and Australia markets. Each market can have its own features while also reusing and extending features from other markets, following DRY (Don't Repeat Yourself) and SOLID principles.

## Architecture

### Collections

#### Markets Collection (`src/collections/Markets.ts`)

The `Markets` collection is the core of the multi-market system. Each market can:

- **Create custom features**: Build unique header, footer, banner, and "How It Works" sections
- **Reuse features**: Reference features from other markets
- **Extend features**: Add additional fields to reused features (e.g., videos to steps)

**Key Fields:**
- `name`: Display name (e.g., Malaysia, Singapore, Australia)
- `code`: Unique code (e.g., MY, SG, AU)
- `isDefault`: Flag for default market

**Feature Tabs:**

1. **Header Tab**
   - `headerType`: 'custom' or 'reuse'
   - `reusedHeader`: Reference to another market's header
   - `overrideLogo`: Override the logo when reusing header
   - `customLogo`: Upload market logo/flag (for custom headers)
   - `customNavItems`: Array of navigation items
   - `ctaButton`: Call-to-action button

2. **Footer Tab**
   - `footerType`: 'custom' or 'reuse'
   - `customFooterLinks`: Array of footer links
   - `socialMedia`: Social media links
   - `contactInfo`: Contact information
   - `reusedFooter`: Reference to another market's footer
   - `additionalFooterLinks`: Extra links that can be added to reused footers

3. **Banner Tab**
   - `bannerType`: 'custom' or 'reuse'
   - `customBannerMedia`: Upload banner image/video
   - `customBannerHeadline`: Banner headline text
   - `customBannerButton`: Banner CTA button
   - `reusedBanner`: Reference to another market's banner
   - `overrideBannerButton`: Override button when reusing banner

4. **How It Works Tab**
   - `howItWorksType`: 'custom' or 'reuse'
   - `customSteps`: Array of custom steps
   - `reusedHowItWorks`: Reference to another market's "How It Works"
   - `extendedSteps`: Add videos or other fields to specific steps

## Reuse and Inheritance Logic

### API Endpoint: `/api/markets/[code]`

The `src/app/api/markets/[code]/route.ts` file contains the core logic for resolving market data:

1. **Recursive Resolution**: Functions like `resolveMarketHeader`, `resolveMarketFooter`, etc., recursively follow reuse relationships
2. **Override Support**: Markets can override specific fields while reusing others (e.g., Singapore reuses Malaysia's banner but changes the button text)
3. **Extension Support**: Markets can add new fields to reused content (e.g., Australia adds videos to Malaysia's "How It Works" steps)

### Example Data Flow

**Malaysia** (Base Market):
- Custom header with MY flag, navigation, and CTA
- Custom footer with links and social media
- Custom banner "Mega Sale - Shop Now"
- Custom "How It Works" with 3 steps

**Singapore** (Reuses Malaysia):
- Header: Reuses Malaysia's header but with SG flag
- Footer: Uses Singapore's custom footer
- Banner: Copies Malaysia's banner but changes button to "Buy Now"
- How It Works: Reuses Malaysia's steps as-is

**Australia** (Mixed Reuse):
- Header: Custom AU header
- Footer: Reuses Singapore's footer + adds "Made in Australia" link
- Banner: Custom banner
- How It Works: Reuses Malaysia's steps + adds video to step 2

## Frontend Pages

### Market List Page: `/markets`

**File**: `src/app/(frontend)/markets/page.tsx`

Displays all available markets with cards showing:
- Market flag emoji
- Market name and code
- Link to market detail page

### Market Detail Page: `/market/[code]`

**File**: `src/app/(frontend)/market/[code]/page.tsx`

Displays market-specific content:
- Banner section with image, headline, and CTA button
- "How It Works" section with steps (including optional videos)
- Footer with links, social media, and contact info

## Seed Data

### Seed File: `src/endpoints/seed/markets.ts`

Pre-configured market data for:
- **Malaysia**: Base market with all custom features
- **Singapore**: Reuses Malaysia's header, banner, and How It Works
- **Australia**: Reuses Singapore's footer and Malaysia's How It Works, with extensions

### Running Seeds

The seed script automatically:
1. Downloads flag images from flagcdn.com
2. Downloads banner images from the template repository
3. Creates media entries
4. Creates markets with proper relationships
5. Sets up reuse references

## API Endpoints

### `GET /api/markets`

Returns a list of all markets with basic information (name, code, updatedAt).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Malaysia",
      "code": "MY",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `GET /api/markets/[code]`

Returns fully resolved market data including all inherited features.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Malaysia",
    "code": "MY",
    "header": {
      "logo": "/media/malaysia-flag.png",
      "navItems": [
        { "label": "Home", "url": "/" },
        { "label": "Products", "url": "/products" }
      ],
      "ctaButton": {
        "label": "Sign Up",
        "url": "/signup"
      }
    },
    "footer": {
      "links": [...],
      "socialMedia": {...},
      "contactInfo": "contact@malaysia.example.com"
    },
    "banner": {
      "media": "/media/banner.png",
      "headline": "Mega Sale – Shop Now",
      "button": {
        "label": "Shop Now",
        "url": "/shop"
      }
    },
    "howItWorks": {
      "steps": [
        {
          "icon": "👤",
          "title": "Sign Up",
          "description": "Create your account in seconds",
          "video": null
        },
        ...
      ]
    }
  }
}
```

## Local Setup Instructions

### Prerequisites

- Node.js 18.20.2 or >= 20.9.0
- pnpm 9 or 10
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mult-market-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   - `DATABASE_URI`: Your database connection string (SQLite by default: `file:./mult-market-app.db`)
   - `PAYLOAD_SECRET`: A random secret key for Payload CMS

4. **Generate TypeScript types**
   ```bash
   npm run generate:types
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

7. **Seed the database** (Optional)
   - Click the "Seed Database" button in the admin panel
   - Or access http://localhost:3000/api/seed

### Login Credentials (After Seeding)

- **Email**: `demo-author@example.com`
- **Password**: `password`

## Usage

### Creating a New Market

1. Go to http://localhost:3000/admin/collections/markets
2. Click "Create New"
3. Fill in market name, code, and set `isDefault` if needed
4. Configure each tab:
   - Choose "Create Custom" or "Reuse from Another Market"
   - If reusing, select the source market
   - Add overrides or extensions as needed
5. Save and publish

### Viewing Markets

1. **All Markets**: Visit http://localhost:3000/markets
2. **Specific Market**: Visit http://localhost:3000/market/[CODE]
   - Example: http://localhost:3000/market/MY

### Testing Reuse Logic

1. Create Malaysia market with custom features
2. Create Singapore market:
   - Set header to reuse Malaysia's header
   - Override logo with Singapore flag
   - Set banner to reuse Malaysia's banner
   - Override button text
3. View both markets to see inheritance working

## Code Quality

### Design Principles Applied

- **DRY (Don't Repeat Yourself)**: Markets can reuse features from other markets
- **SOLID Principles**:
  - **Single Responsibility**: Each resolver function handles one concern
  - **Open/Closed**: Easy to extend with new fields without modifying existing code
  - **Liskov Substitution**: Markets can be used interchangeably
  - **Interface Segregation**: Clean API responses
  - **Dependency Inversion**: API routes depend on abstractions, not implementations

### Code Structure

```
src/
├── collections/
│   └── Markets.ts              # Market collection configuration
├── app/
│   ├── api/
│   │   └── markets/
│   │       ├── route.ts        # List all markets
│   │       └── [code]/route.ts # Get market by code with resolution
│   └── (frontend)/
│       ├── markets/
│       │   └── page.tsx        # Market listing page
│       └── market/
│           └── [code]/page.tsx # Market detail page
├── endpoints/
│   └── seed/
│       ├── index.ts            # Main seed logic
│       └── markets.ts          # Market seed data
```

## Extension Guide

### Adding a New Feature Type

1. Add field to Markets collection in `src/collections/Markets.ts`
2. Create resolver function in `src/app/api/markets/[code]/route.ts`
3. Update frontend component in `src/app/(frontend)/market/[code]/page.tsx`
4. Update seed data in `src/endpoints/seed/markets.ts`
5. Run `npm run generate:types`

### Adding a New Market

1. Add seed data to `src/endpoints/seed/markets.ts`
2. Set reuse relationships as needed
3. Configure overrides and extensions
4. Run seed script

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Docker Deployment

1. Build image:
   ```bash
   docker build -t mult-market-app .
   ```
2. Run container:
   ```bash
   docker run -p 3000:3000 mult-market-app
   ```

### Environment Variables for Production

- `DATABASE_URI`: Production database connection
- `PAYLOAD_SECRET`: Strong random secret
- `NEXT_PUBLIC_SERVER_URL`: Public server URL (for API calls)

## Troubleshooting

### Type Errors

Run `npm run generate:types` after any schema changes.

### Seed Errors

Check that all media URLs are accessible and database is properly initialized.

### Reuse Not Working

Verify that:
1. Source market has custom features (not empty)
2. Reuse reference is correctly set
3. Resolver functions are handling edge cases

## Contributing

1. Create feature branch from `main`
2. Make changes following existing patterns
3. Test thoroughly
4. Create pull request with clear description

## License

MIT License - See LICENSE file for details

