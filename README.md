# Aurum Vest - Advanced Crypto Trading Platform

<div align="center">
  <h3>Professional-grade automated trading bots that execute strategies 24/7</h3>
  <p>Maximizing profits even while you sleep</p>
</div>

## 🚀 Overview

Aurum Vest is a comprehensive cryptocurrency trading platform that combines cutting-edge automation with user-friendly design. Built for both novice and professional traders, it offers sophisticated trading bots, real-time analytics, and secure wallet management.

### 🌟 Key Features

- **🤖 Automated Trading Bots**: Create and manage custom trading strategies with 24/7 execution
- **💰 Multi-Asset Wallet**: Secure portfolio management across multiple cryptocurrencies  
- **📊 Real-Time Analytics**: Advanced technical analysis with AI-powered market predictions
- **🛡️ Bank-Grade Security**: State-of-the-art encryption and security protocols
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices
- **🔔 Smart Alerts**: Real-time notifications for market events and bot activities
- **👥 Community Features**: Active trading community with strategy sharing
- **🎯 Risk Management**: Customizable stop-loss and take-profit parameters

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling framework
- **Shadcn/UI** - Premium component library
- **React Router DOM** - Client-side routing
- **React Query** - Server state management
- **Recharts** - Data visualization

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Advanced data protection
- **Real-time subscriptions** - Live data updates

### Development Tools
- **Vite** - Lightning-fast build tool
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Lovable Tagger** - Component tracking

## 📊 Database Schema

### Core Tables
- **profiles** - User profile information
- **user_roles** - Role-based access control
- **trading_bots** - Automated trading bot configurations
- **bot_trades** - Trading execution history
- **wallet_assets** - User cryptocurrency holdings
- **wallet_transactions** - Transaction history
- **signals** - Trading signals and recommendations
- **support_tickets** - Customer support system

### Security Features
- Row Level Security (RLS) policies on all tables
- JWT-based authentication
- User role management system
- Encrypted sensitive data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aurum-vest.git
cd aurum-vest

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Required variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

**⚠️ Security Note:** Never commit your `.env` file. See [docs/environment.md](docs/environment.md) for detailed setup instructions.

## 🏃‍♂️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run unit tests (Vitest)
npx playwright test  # Run E2E tests
```

## 📁 Project Structure

```
aurum-vest/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (shadcn)
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── admin/          # Admin panel components
│   │   └── trading/        # Trading-specific components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions
│   ├── pages/             # Route components
│   └── index.css          # Global styles & design system
├── public/                # Static assets
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge functions
│   └── config.toml        # Supabase config
├── e2e/                   # End-to-end tests (Playwright)
├── docs/                  # 📚 Project documentation
│   ├── cleanup_report.md          # Repository cleanup details
│   ├── collaboration.md           # Contribution guidelines
│   ├── content_management.md      # CMS guide
│   ├── environment.md             # Environment setup
│   ├── implementation_summary.md  # Feature implementation
│   ├── optimization.md            # Performance optimization
│   ├── real_market_data.md       # Market data integration
│   ├── security_findings.md      # Security audit results
│   ├── websocket_notifications.md # Real-time notifications
│   └── todo.md                   # Project roadmap
└── README.md              # This file
```

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication via Supabase Auth
- Multi-factor authentication support
- Role-based access control (Admin, Sub-Admin, User)
- Session management with device tracking

### Data Protection
- Row Level Security (RLS) on all database tables
- Encrypted sensitive data storage
- API rate limiting
- Input validation and sanitization

### Trading Security
- Secure API key storage for exchanges
- Transaction verification
- Audit trails for all trading activities
- Real-time fraud detection

## 🎨 Design System

### Color Scheme
- **Primary**: Binance-inspired yellow (#F0B90B)
- **Background**: Dark theme with subtle gradients
- **Cards**: Glass morphism effects
- **Typography**: Clean, modern font stack

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized interactions

## 🔄 State Management

### Client State
- React Context for authentication
- Local component state with useState
- Custom hooks for data fetching

### Server State
- React Query for API data caching
- Real-time updates via Supabase subscriptions
- Optimistic updates for better UX

## 🚦 Performance

### Optimization Techniques
- Lazy loading for route components
- Image optimization and caching
- Bundle splitting and code splitting
- Efficient re-rendering with React.memo

### Monitoring
- Performance metrics tracking
- Error boundary implementation
- User analytics integration
- Real-time error reporting

## 🧪 Testing Strategy

### Testing Stack
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing across browsers
- **Testing Library User Event** - User interaction simulation

### Test Suites
- ✅ **E2E Tests** (`e2e/`) - Landing page, auth flows, dashboard, accessibility
- ✅ **Unit Tests** (`src/**/__tests__/`) - Components, hooks, utilities
- ✅ **Integration Tests** - Supabase edge functions

### Running Tests
```bash
npm run test              # Unit tests
npx playwright test       # E2E tests (all browsers)
npx playwright test --ui  # E2E tests with UI
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

### Environment Setup
- Configure environment variables in deployment platform
- Set up domain and SSL certificates
- Configure CDN for static assets

## 📈 Analytics & Monitoring

### Metrics Tracking
- User engagement analytics
- Trading performance metrics
- System performance monitoring
- Error tracking and alerting

### Business Intelligence
- Revenue tracking
- User acquisition metrics
- Trading volume analytics
- Platform usage statistics

## 🤝 Contributing

We welcome contributions! Please see our [Collaboration Guide](docs/collaboration.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Run tests (`npm run test && npx playwright test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Submit a pull request

### Code Quality
- Follow TypeScript best practices
- Use semantic CSS tokens from design system
- Write comprehensive tests
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### 📚 Documentation
All documentation is now organized in the `/docs` folder:

- **[Environment Setup](docs/environment.md)** - Environment variables guide
- **[Security Findings](docs/security_findings.md)** - Security audit & PWA limitations
- **[Implementation Summary](docs/implementation_summary.md)** - Feature implementation details
- **[Optimization Guide](docs/optimization.md)** - Performance optimization strategies
- **[Market Data Integration](docs/real_market_data.md)** - Real-time data implementation
- **[WebSocket Notifications](docs/websocket_notifications.md)** - Real-time notification system
- **[Content Management](docs/content_management.md)** - CMS features guide
- **[Collaboration Guide](docs/collaboration.md)** - Contributing guidelines
- **[Project Roadmap](docs/todo.md)** - Upcoming features and tasks
- **[Cleanup Report](docs/cleanup_report.md)** - Recent repository cleanup details

### 🛠️ Technical Support
- GitHub Issues for bug reports
- Pull requests for code contributions
- Security issues: Report privately to maintainers

### 📊 Project Status
- [View Project Board](https://github.com/aurumvest/project-board)
- [Roadmap](docs/todo.md)
- Build Status: ✅ All tests passing

---

## 🧹 Recent Updates

**Repository Cleanup (2025-10-25)**
- ✅ Documentation organized into `/docs` folder
- ✅ PWA installation features disabled (web-only application)
- ✅ Environment files sanitized and security improved
- ✅ E2E testing suite implemented with Playwright
- ✅ Search engine indexing blocked (`robots.txt` + meta tags)
- ✅ Service worker caching disabled

See [docs/cleanup_report.md](docs/cleanup_report.md) for complete details.

---

<div align="center">
  <p>Built with ❤️ by the Aurum Vest Team</p>
  <p>© 2024-2025 Aurum Vest. All rights reserved.</p>
</div>