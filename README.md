# abhimanyuneupane.com

Personal site for Abhimanyu Neupane. Next.js 15 on Vercel, Supabase for posts, settings, image storage and admin sign-in.

- Public site: `/`, `/blog`, `/YYYY/MM/DD/slug` (same URLs as the old WordPress site), `/resume`, `/feed.xml`, `/sitemap.xml`
- Admin: `/admin`, sign in with Google. Only the email in the `public.admins` table can write; this is enforced by row-level security in the database, not just the UI.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `npx vercel` inside it).
2. In Vercel, **Add New → Project**, import the repo. Framework: Next.js (auto-detected).
3. Add these environment variables (Production + Preview):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nztobuxccpkfigmxqqmb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the publishable key from Supabase → Project Settings → API Keys |
| `NEXT_PUBLIC_SITE_URL` | `https://abhimanyuneupane.com` |
| `ADMIN_EMAIL` | `abhimanyuneupane1@gmail.com` |

4. Deploy.

## Turn on Google sign-in (one time, ~5 minutes)

1. **Google Cloud Console** → APIs & Services → Credentials → **Create credentials → OAuth client ID** → Web application.
   - Authorized redirect URI: `https://nztobuxccpkfigmxqqmb.supabase.co/auth/v1/callback`
   - (First time only: fill in the OAuth consent screen, External, add your email as a test user or publish it.)
2. **Supabase** → Authentication → Sign In / Providers → **Google** → enable, paste the Client ID and Client Secret, save.
3. **Supabase** → Authentication → URL Configuration:
   - Site URL: `https://abhimanyuneupane.com`
   - Redirect URLs: add `https://abhimanyuneupane.com/**`, `https://*.vercel.app/**` and `http://localhost:3000/**`

Optional hardening: Supabase → Authentication → Sign In / Providers → **Email** → disable, so the only way to sign in is Google.

## Point the domain at Vercel

Vercel → Project → Settings → Domains → add `abhimanyuneupane.com` and `www.abhimanyuneupane.com`, then update DNS at your registrar to the records Vercel shows. Old WordPress links (`/2024/05/18/...`, `/category/...`, `/feed`) keep working.

## Local development

```bash
cp .env.example .env.local   # fill in the anon key
npm install
npm run dev
```
