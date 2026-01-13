# Fresh Folds

A subscription-based laundry service marketplace connecting busy households with local laundry providers in the Phoenix metro area.

## Overview

Fresh Folds makes laundry day effortless. Customers subscribe to a plan, set out their laundry bags on scheduled pickup days, and receive freshly washed and folded clothes within 48 hours. Local providers handle the washing, creating flexible income opportunities in their communities.

## Features

### Customer App
- **Zip Code Validation** - Check service availability in Phoenix metro
- **Subscription Plans** - Choose from Small (1-2 people), Medium (3-4 people), or Large (5+ people) household sizes
- **Flexible Scheduling** - Weekly, bi-weekly, or twice-weekly pickup options
- **Dashboard** - View upcoming pickups, manage subscription, update account
- **Skip Pickups** - Skip any pickup with 24-hour notice

### Tech Stack
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Subscriptions (optional for demo)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (optional)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (optional - app works in demo mode without these)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Database Setup

Run the SQL schema in your Supabase project:

```bash
# The schema is located at:
supabase/schema.sql
```

## Demo Mode

The app works without Stripe configuration for demonstration purposes:
- Onboarding flow skips payment and redirects to success
- All other features work normally
- Perfect for showing concepts to clients

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup, etc.)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard-specific components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   ├── stripe/           # Stripe client setup
│   └── constants.ts      # App constants
└── types/                # TypeScript type definitions
```

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

Private - All rights reserved
