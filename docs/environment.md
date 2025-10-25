# Environment Variables

## Required Environment Variables

All environment variables must be set before running the application.

### Supabase Configuration
```bash
VITE_SUPABASE_URL=              # Your Supabase project URL
VITE_SUPABASE_PUBLISHABLE_KEY=  # Your Supabase anon/public key
VITE_SUPABASE_PROJECT_ID=       # Your Supabase project ID
```

### Optional Configuration
```bash
VITE_VAPID_PUBLIC_KEY=          # Web Push notification public key (if using push notifications)
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials:**
   - Get Supabase credentials from: https://supabase.com/dashboard
   - Navigate to: Project Settings → API
   - Copy the Project URL and anon/public key

3. **Never commit `.env`:**
   - The `.env` file is in `.gitignore`
   - Only `.env.example` should be committed
   - Keep actual credentials secret

## Security Best Practices

### ✅ DO
- Use `.env.example` as a template
- Store actual credentials in `.env` locally
- Rotate credentials if exposed
- Use environment-specific files (`.env.production`, `.env.development`)

### ❌ DON'T
- Never commit `.env` to version control
- Never share credentials in chat or email
- Never hardcode credentials in code
- Never use production credentials in development

## Supabase Edge Functions

Edge functions have access to secrets configured in the Supabase dashboard:
- `SUPABASE_SERVICE_ROLE_KEY`
- `HUGGINGFACE_API_KEY`
- `OPENROUTER_API_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `EXCHANGE_RATE_API_KEY`
- And others...

These are configured separately and not stored in `.env` files.

## Troubleshooting

**Issue:** "Invalid API key" error
- **Solution:** Check that your `.env` file exists and has correct values

**Issue:** Supabase connection fails
- **Solution:** Verify project URL and key match your Supabase dashboard

**Issue:** Changes to `.env` not taking effect
- **Solution:** Restart the dev server after modifying `.env`

---

For more information, see: https://vitejs.dev/guide/env-and-mode.html
