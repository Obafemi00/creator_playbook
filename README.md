# Creator Playbook

Not a course. Not a hustle. This is a journey.

A premium membership platform built with Next.js, Supabase, and Stripe.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Fonts**: Baloo 2 (headlines) + DM Sans (body) via next/font
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Payments**: Stripe Checkout + Customer Portal
- **Animations**: Framer Motion

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_PRICE_ID_MONTHLY=your_monthly_price_id
NEXT_PUBLIC_PRICE_ID_ANNUAL=your_annual_price_id
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in the Supabase SQL editor
3. Create two storage buckets:
   - `cp-assets` (public or controlled) - for images/thumbnails
   - `cp-files` (private) - for PDFs/templates
4. Set up storage policies:
   - `cp-assets`: Allow public read, admin write
   - `cp-files`: Private, use signed URLs for downloads

### 4. Stripe Setup

1. Create a Stripe account
2. Create two products with prices:
   - Monthly subscription
   - Annual subscription
3. Copy the price IDs to your `.env.local`
4. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
5. Enable these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Create Admin User

1. Sign up via `/login` (admin login page)
2. In Supabase dashboard, update the user's profile:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
   ```

### 6. Seed Data

```bash
npm run seed
```

This will create:
- 1 sample event (Chapter 01: INTENTION)
- 3 sample tools

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  /account          # Member account pages
  /admin            # Admin CMS pages
  /events           # Event listing and detail pages
  /toolbox          # Toolbox listing and detail pages
  /api              # API routes (webhooks, email unlock)
  /actions          # Server actions (Stripe checkout/portal)
/components         # React components
/lib                # Utilities (Supabase clients, auth helpers)
/supabase           # Database schema SQL
/scripts            # Seed scripts
```

## Features

### Public Access
- Homepage with latest event preview
- Events listing (free previews visible)
- Toolbox listing (email-gated tools)
- Pricing page
- About page

### Member Access
- Full access to all events
- Member-gated tools
- Account dashboard
- Stripe Customer Portal for billing

### Admin Access
- Admin dashboard with stats
- Event management (create/edit/publish)
- Toolbox management (create/edit/publish)
- File uploads to Supabase Storage

### Security
- Row Level Security (RLS) policies on all tables
- Admin role-based access control
- Private file storage with signed URLs
- Secure Stripe webhook verification

## Routes

### Public
- `/` - Home
- `/events` - Events listing
- `/events/[slug]` - Event detail
- `/toolbox` - Toolbox listing
- `/toolbox/[slug]` - Tool detail
- `/pricing` - Pricing plans
- `/about` - About page
- `/signin` - Member sign-in
- `/login` - Admin login
- `/privacy`, `/terms`, `/refunds` - Legal pages

### Member
- `/account` - Account dashboard
- `/account/welcome` - Post-checkout success

### Admin
- `/admin` - Admin dashboard
- `/admin/events` - Events management
- `/admin/events/new` - Create event
- `/admin/events/[id]/edit` - Edit event
- `/admin/toolbox` - Tools management
- `/admin/toolbox/new` - Create tool
- `/admin/toolbox/[id]/edit` - Edit tool

## Database Schema

### Tables
- `profiles` - User profiles with roles (admin/member/public)
- `memberships` - Stripe subscription data
- `events` - Monthly events/chapters
- `tools` - Toolbox items (download/interactive/link)
- `email_unlocks` - Email-gated tool access
- `action_completions` - User event completion tracking

See `supabase/schema.sql` for full schema and RLS policies.

## Deployment

1. Deploy to Vercel (recommended for Next.js)
2. Set environment variables in Vercel dashboard
3. Update `NEXT_PUBLIC_SITE_URL` to your production URL
4. Update Stripe webhook URL to production endpoint
5. Test webhook with Stripe CLI or dashboard

## License

Private - All rights reserved

# creator_playbook
