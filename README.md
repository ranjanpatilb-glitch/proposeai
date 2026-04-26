# ProposeAI — Full Deployment Guide

## What this is
A complete Next.js SaaS app that generates AI-powered business proposals using the Claude API. Includes real auth (Supabase), database, and Stripe payments.

---

## Your total cost at launch: $0

| Service | Cost |
|---|---|
| Vercel (hosting) | Free |
| Supabase (auth + DB) | Free |
| GitHub (code) | Free |
| Stripe (payments) | Free — 2.9% per charge only |
| Resend (email) | Free |
| Anthropic API | ~$0.01–0.03 per proposal |

---

## Step 1 — Get accounts (15 min)

Sign up for these (all free):
- https://github.com
- https://vercel.com (sign in with GitHub)
- https://supabase.com (sign in with GitHub)
- https://stripe.com
- https://console.anthropic.com

---

## Step 2 — Set up Supabase (10 min)

1. Go to https://supabase.com > New Project
2. Name it: `proposeai`, set a password, pick your region
3. Wait ~2 minutes for setup
4. Go to **SQL Editor** and paste the entire contents of `supabase-setup.sql`, then click **Run**
5. Go to **Settings > API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (keep this SECRET — for webhooks only)

---

## Step 3 — Get your Anthropic API key (5 min)

1. Go to https://console.anthropic.com
2. Click **API Keys > Create Key**
3. Name it: `ProposeAI Production`
4. Copy the key — you only see it once!
5. Recommended: set a monthly spend limit of $10 under **Billing > Usage limits**

---

## Step 4 — Set up Stripe (20 min)

1. Go to https://stripe.com and sign up
2. Go to **Products > Add product** and create 3 products:
   - **Solo**: $39/month recurring → copy the Price ID (`price_xxx`)
   - **Pro**: $99/month recurring → copy the Price ID
   - **Team**: $249/month recurring → copy the Price ID
3. Go to **Developers > API Keys** and copy:
   - Publishable key (`pk_live_...`)
   - Secret key (`sk_live_...`)
4. For webhooks (after deploying to Vercel):
   - Go to **Developers > Webhooks > Add endpoint**
   - URL: `https://your-app.vercel.app/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_...`)

---

## Step 5 — Push to GitHub (5 min)

```bash
# In your terminal, from this folder:
git init
git add .
git commit -m "Initial ProposeAI commit"

# Create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/proposeai.git
git push -u origin main
```

Or use GitHub Desktop (no terminal needed): https://desktop.github.com

---

## Step 6 — Deploy to Vercel (10 min)

1. Go to https://vercel.com > **Add New > Project**
2. Import your `proposeai` GitHub repository
3. Before clicking Deploy, click **Environment Variables** and add ALL of these:

```
NEXT_PUBLIC_SUPABASE_URL          = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJ...
SUPABASE_SERVICE_ROLE_KEY         = eyJ...  (keep secret!)
ANTHROPIC_API_KEY                 = sk-ant-api03-...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY                 = sk_live_...
STRIPE_WEBHOOK_SECRET             = whsec_...  (add after step 4 webhook)
STRIPE_PRICE_SOLO                 = price_...
STRIPE_PRICE_PRO                  = price_...
STRIPE_PRICE_TEAM                 = price_...
NEXT_PUBLIC_APP_URL               = https://your-app.vercel.app
```

4. Click **Deploy** — your app is live in ~60 seconds!

---

## Step 7 — Add your Vercel URL to Supabase (2 min)

1. In Supabase > **Authentication > URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app`
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Step 8 — Test end-to-end

1. Visit your live URL
2. Click **Start free trial** → sign up with a real email
3. Create a new proposal (fill in the form)
4. Verify the proposal generates and saves correctly
5. Try the **Regenerate** button on a section
6. Go to Pricing and test Stripe checkout (use card `4242 4242 4242 4242`, any future date, any CVC)

---

## Running locally (for development)

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Fill in your values in .env.local

# Start dev server
npm run dev
# → Open http://localhost:3000
```

---

## File structure

```
proposeai/
├── app/
│   ├── page.js              # Landing page
│   ├── layout.js            # Root layout
│   ├── globals.css          # Global styles
│   ├── auth/page.js         # Login + signup
│   ├── dashboard/
│   │   ├── page.js          # Proposals list
│   │   └── new/page.js      # Multi-step intake form
│   ├── proposal/[id]/page.js # Proposal viewer + editor
│   ├── pricing/page.js      # Pricing + Stripe checkout
│   └── api/
│       ├── generate/route.js       # Claude API — full proposal
│       ├── regenerate/route.js     # Claude API — single section
│       ├── create-checkout/route.js # Stripe checkout session
│       └── webhook/route.js        # Stripe webhook handler
├── lib/
│   ├── supabase.js          # Supabase browser client
│   ├── supabase-server.js   # Supabase server client
│   └── prompts.js           # Claude system + user prompts
├── supabase-setup.sql       # Run this in Supabase SQL Editor
├── .env.example             # Copy to .env.local and fill in
└── README.md                # This file
```

---

## Custom domain (optional, $12/year)

1. Buy a domain at https://namecheap.com (e.g. `proposeai.io`)
2. In Vercel > your project > **Settings > Domains**
3. Add your domain — Vercel gives you the DNS records to set
4. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
5. Update Site URL in Supabase

---

## Go-to-market: what to do the day you launch

1. Post in r/freelance and r/webdev — share a before/after proposal example
2. DM 10 agency owners on LinkedIn — offer a free 14-day trial
3. Submit to Product Hunt: https://producthunt.com/posts/new
4. List on AppSumo for a lifetime deal (drives early cash)

---

Built with Next.js 14 · Supabase · Stripe · Anthropic Claude API



