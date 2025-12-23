# Creator Playbook

Not a course. Not a hustle. This is a journey.

A calm, artsy platform for monthly creator events with $1 document unlocks.

## Stack

- Next.js 14 (App Router) + React 18
- TypeScript
- TailwindCSS
- Framer Motion
- Supabase (Auth + Storage + Database)
- Stripe (Payments)
- Zod + react-hook-form

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Create storage bucket: `creator-playbook-pdfs` (private) for document storage
4. Set bucket policies:
   - Public: no read access
   - Authenticated: read/write via service role only

### 4. Stripe Setup

1. Create a Stripe account
2. Get your API keys (test mode)
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Enable event: `checkout.session.completed`

### 5. Create First Admin

1. Sign up at `/admin/sign-in`
2. In Supabase SQL editor, run:
   ```sql
   INSERT INTO admin_profiles (user_id, role)
   SELECT id, 'OWNER' FROM auth.users WHERE email = 'your@email.com';
   ```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

### Public Site
- Home page with latest volume preview
- Events page listing all published volumes
- Toolbox page (email-gated)
- About page
- $1 document unlock flow via Stripe Checkout

### Admin
- Dashboard with stats
- Volume management (CRUD)
- Document upload to Supabase Storage
- Admin management (OWNER only)
- Protected routes with role-based access

## Project Structure

```
/app
  /admin              # Admin pages
  /events             # Public events pages
  /playbook           # Playbook page
  /api                # API routes (webhooks, signups)
  /actions            # Server actions (Stripe)
/components
  /admin              # Admin components
  /home               # Home page components
  /motion             # Motion primitives
/lib                  # Utilities (Supabase, auth)
/supabase             # Database schema
```

## Design System

- **Fonts**: Baloo 2 (headlines), DM Sans (body)
- **Colors**: Orange (#FF7A1A), Off-white (#FFF6EE), Teal, Lavender, Charcoal
- **Motion**: Slow, gentle, fade/slide/drift only
- **Aesthetic**: Calm, artsy, minimal, asymmetric

## License

Private - All rights reserved
