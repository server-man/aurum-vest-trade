# 🏆 Aurum Vest - Automated Crypto Trading Platform

[![CI Pipeline](https://github.com/server-man/aurum-vest-trade/actions/workflows/ci.yml/badge.svg)](https://github.com/server-man/aurum-vest-trade/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Professional-grade automated trading bots with AI-powered signals, real-time analytics, and bank-level security.

## 🔗 Links

- **Production**: [aurumvest.netlify.app](https://aurumvest.netlify.app)
- **GitHub**: [server-man/aurum-vest-trade](https://github.com/server-man/aurum-vest-trade)

## ✨ Key Features

- 🤖 **Automated Trading Bots** - 24/7 strategy execution with customizable parameters
- 📊 **Real-Time Analytics** - Live market data, AI predictions, and technical analysis
- 💰 **Multi-Asset Wallet** - Secure portfolio management across cryptocurrencies
- 🔔 **Smart Alerts** - Price notifications and trading signals via WebSocket
- 🛡️ **Enterprise Security** - HTTP-only cookies, RLS policies, JWT authentication
- 📱 **Responsive Design** - Seamless experience across all devices

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/server-man/aurum-vest-trade.git
cd aurum-vest-trade

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080`

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI, React Query  
**Backend**: Supabase (PostgreSQL, Edge Functions, Auth, Storage)  
**Tools**: Vite, Playwright (E2E), Vitest (Unit Tests), ESLint

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/         # Base components (shadcn)
│   ├── dashboard/  # Dashboard widgets
│   ├── admin/      # Admin panel
│   └── trading/    # Trading components
├── contexts/       # React contexts (Auth, Theme)
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client
├── pages/          # Route components
└── lib/            # Utilities

supabase/
├── functions/      # Edge functions
└── migrations/     # Database migrations
```

## 🧪 Testing

```bash
npm run test              # Unit tests (Vitest)
npm run test:coverage     # Coverage report
npx playwright test       # E2E tests
npx playwright test --ui  # E2E with UI
```

**Test Coverage**:
- ✅ E2E: Landing page, authentication, dashboard, accessibility
- ✅ Unit: Components, hooks, utilities
- ✅ Integration: Edge functions, database operations

## 🔐 Security Features

✅ **Authentication**: JWT + MFA + WebAuthn passkeys  
✅ **Authorization**: Role-based access control (Admin/User)  
✅ **Data Protection**: Row-level security on all tables  
✅ **Session Management**: HTTP-only cookies, server-side token verification  
✅ **Admin Access**: Secure verification flow with GitHub OAuth  
✅ **Audit Logs**: Comprehensive tracking of admin actions

See [docs/security_findings.md](docs/security_findings.md) for latest security audit.

## 🚀 Deployment

**Current Setup**: Lovable → GitHub → Netlify

1. Push changes to GitHub
2. Netlify automatically builds and deploys
3. Production: `https://aurumvest.xyz`

**Environment**:
- Supabase credentials: Configured in `src/integrations/supabase/client.ts`
- Edge function secrets: Managed in Supabase Dashboard
- Node version: 18+ (see `netlify.toml`)

## 📚 Documentation

- [Environment Setup](docs/environment.md)
- [Security Audit](docs/security_findings.md)
- [Content Management](docs/content_management.md)
- [WebSocket Integration](docs/websocket_notifications.md)
- [Performance Optimization](docs/optimization.md)
- [Contributing Guide](docs/collaboration.md)

## 📜 Scripts

```bash
npm run dev          # Development server (port 8080)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run test         # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Follow TypeScript best practices, write tests, and update documentation.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

**Built with ❤️ by Aurum Vest Team** | © 2024-2025 Aurum Vest
