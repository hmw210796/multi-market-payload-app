# Quick Start Guide

Get your Multi-Market application up and running in 5 minutes!

## Prerequisites

- Node.js 18.20.2 or >= 20.9.0
- pnpm 9 or 10

## Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd mult-market-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and ensure these variables are set:

   ```env
   DATABASE_URI=file:./mult-market-app.db
   PAYLOAD_SECRET=your-random-secret-here
   ```

4. **Generate types**

   ```bash
   npm run generate:types
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```

## First Steps

### 1. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 2. Seed the Database

The database needs to be seeded with market data:

**Option A: Using the Admin UI** (Recommended)

1. Go to http://localhost:3000/admin
2. Follow the setup wizard to create your first admin user
3. Once in the dashboard, look for the "Seed Database" button
4. Click it and wait for seeding to complete (takes ~30 seconds)

**Option B: Using the API**

```bash
curl http://localhost:3000/api/seed
```

### 3. View Markets

- **All Markets**: http://localhost:3000/markets
- **Malaysia**: http://localhost:3000/market/MY
- **Singapore**: http://localhost:3000/market/SG
- **Australia**: http://localhost:3000/market/AU

## Demo Credentials

After seeding, you can use these credentials to login:

- **Email**: `demo-author@example.com`
- **Password**: `password`

> Note: The demo author will only exist after you've clicked the "Seed Database" button.

## What You Get

### Pre-configured Markets

1. **Malaysia (MY)** - Base market with all custom features
   - Custom header with Malaysia flag
   - Custom footer
   - "Mega Sale - Shop Now" banner
   - 3-step "How It Works" process

2. **Singapore (SG)** - Demonstrates feature reuse
   - Reuses Malaysia's header (with SG flag)
   - Custom footer
   - Reuses Malaysia's banner but changes button to "Buy Now"
   - Reuses Malaysia's "How It Works" steps

3. **Australia (AU)** - Demonstrates mixed reuse and extensions
   - Custom header with AU flag
   - Reuses Singapore's footer + adds "Made in Australia" link
   - Custom banner
   - Reuses Malaysia's "How It Works" + adds video to step 2

## Key Features to Explore

### 1. Feature Reuse

- Go to admin panel → Markets → Edit Singapore
- See how it reuses Malaysia's header, banner, and steps
- Notice the logo override

### 2. Extensions

- Go to admin panel → Markets → Edit Australia
- See how it extends Singapore's footer with extra links
- See how it extends Malaysia's steps with a video

### 3. API

Visit the API endpoints:

- `GET /api/markets` - List all markets
- `GET /api/markets/MY` - Get fully resolved Malaysia data

### 4. Frontend

- Browse `/markets` to see all markets
- Click each market to see its custom/reused content
- Notice how Singapore inherits from Malaysia
- Notice how Australia inherits from both

## Next Steps

1. **Create a New Market**: Add a fourth market (e.g., Indonesia)
2. **Customize Features**: Modify banner text, add new links
3. **Explore Admin UI**: See how content is managed
4. **Read Full Docs**: See [MULTI_MARKET_SETUP.md](./MULTI_MARKET_SETUP.md)

## Troubleshooting

### "Cannot find module @payload-config"

Run: `npm run generate:types`

### "Database not seeded"

Visit http://localhost:3000/admin and click "Seed Database"

### "Port 3000 already in use"

Change port in `package.json` or stop the other process

### Types are out of sync

Always run `npm run generate:types` after schema changes

## Need Help?

- 📖 Full Documentation: [MULTI_MARKET_SETUP.md](./MULTI_MARKET_SETUP.md)
- 📝 General README: [README.md](./README.md)
- 💬 Questions: Open an issue

Happy coding! 🚀
