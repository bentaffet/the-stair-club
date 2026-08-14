# The Stair Club Preorder

A simple one-page landing site for a competitive stair-counter app.

## Vercel

1. Import this folder into Vercel as a Next.js project.
2. Add these environment variables:

```bash
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_8x2bJ02PE3eRcGDb741RC00
SUPABASE_URL=https://uncupkrdwagtejkeqpvv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_supabase_secret_or_service_role_key
```

3. Deploy.

## Supabase Waitlist

Create this table in the Supabase SQL editor:

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'landing_page',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;
```

Use the Supabase project URL for `SUPABASE_URL`.
Use a Supabase secret key (`sb_secret_...`) or legacy service role key for `SUPABASE_SERVICE_ROLE_KEY`; keep it server-side only in Vercel and do not expose it with a `NEXT_PUBLIC_` prefix.

The site writes through a Next.js API route, so the browser never receives the server key.

## Local Development

```bash
npm install
npm run dev
```

## Notes

- The Early Adopter button uses `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.
- The Join Waitlist button saves emails to the Supabase `waitlist` table through `/api/waitlist`.
