# Collaboration Guide - Aurum Vest

Welcome to the Aurum Vest development team! This guide will help you get started and contribute effectively to our crypto trading platform.

## 🎯 Project Overview

Aurum Vest is a professional cryptocurrency trading platform focusing on automated trading bots, portfolio management, and real-time analytics. We're building a secure, scalable, and user-friendly platform for both novice and experienced traders.

## 🏗️ Development Setup

### Prerequisites
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher  
- **Git**: Latest version
- **VS Code**: Recommended IDE
- **Supabase Account**: For backend services

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/aurumvest/aurum-vest.git
cd aurum-vest

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:5173
```

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🔄 Git Workflow

### Branch Strategy
We use a **Git Flow** based approach:

```
main           # Production-ready code
├── develop    # Integration branch for features
├── feature/*  # New features
├── hotfix/*   # Critical production fixes
└── release/*  # Release preparation
```

### Branch Naming Convention
- `feature/AUTH-123-implement-2fa` (Feature branches)
- `hotfix/URGENT-fix-login-issue` (Hotfixes)
- `release/v1.2.0` (Release branches)
- `bugfix/DASH-456-fix-chart-display` (Bug fixes)

### Commit Message Format
We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(auth): add two-factor authentication
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): optimize database queries
test(auth): add login flow tests
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔍 Code Review Process

### Pull Request Guidelines
1. **Create descriptive PR titles**
   ```
   feat(trading-bots): implement DCA strategy creation
   ```

2. **Fill out PR template completely**
   - Description of changes
   - Testing instructions
   - Screenshots (if UI changes)
   - Breaking changes (if any)

3. **Ensure CI checks pass**
   - All tests passing
   - Linting issues resolved
   - Build successful
   - No security vulnerabilities

### Review Checklist
**Functionality**
- [ ] Feature works as described
- [ ] Edge cases handled appropriately
- [ ] Error handling implemented
- [ ] Performance implications considered

**Code Quality**
- [ ] Code follows project conventions
- [ ] Functions are well-documented
- [ ] No code duplication
- [ ] Security best practices followed

**Testing**
- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Accessibility tested

### Code Review Etiquette
- **Be constructive** in feedback
- **Ask questions** instead of making demands
- **Suggest alternatives** when identifying issues
- **Acknowledge good code** and improvements
- **Review promptly** (within 24 hours)

## 🧪 Testing Standards

### Testing Strategy
```
Unit Tests (70%)     # Individual component/function testing
Integration Tests (20%)  # Feature workflow testing
E2E Tests (10%)      # Full user journey testing
```

### Testing Guidelines
- **Write tests first** (TDD approach)
- **Test behavior, not implementation**
- **Use descriptive test names**
- **Mock external dependencies**
- **Keep tests fast and isolated**

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Cypress**: End-to-end testing

## 📁 Project Structure Guidelines

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (buttons, inputs)
│   ├── dashboard/      # Dashboard-specific components
│   └── trading/        # Trading-specific components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Route components
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

### Naming Conventions
- **Components**: PascalCase (`TradingBot.tsx`)
- **Hooks**: camelCase with "use" prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types**: PascalCase (`UserProfile.ts`)

### Import Order
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party library imports
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// 3. Internal imports
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

// 4. Type imports
import type { User } from '@/types/auth';
```

## 🎨 UI/UX Guidelines

### Design System
We use a **design token** approach with Tailwind CSS:

```css
/* Use semantic color tokens */
.button-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

/* Avoid hardcoded colors */
.avoid-this {
  background: #f0b90b; /* ❌ Don't do this */
}
```

### Component Patterns
- **Compound Components** for complex UI
- **Render Props** for flexible components
- **Custom Hooks** for business logic
- **Context** for shared state

### Accessibility Standards
- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** validation

## 🔒 Security Guidelines

### Authentication & Authorization
- **Never store sensitive data** in localStorage
- **Use JWT tokens** properly
- **Implement RBAC** (Role-Based Access Control)
- **Validate permissions** on both client and server

### Data Handling
- **Sanitize user inputs**
- **Use parameterized queries**
- **Implement rate limiting**
- **Encrypt sensitive data**

### API Security
- **Use HTTPS** for all requests
- **Implement CORS** properly
- **Validate all inputs**
- **Use secure headers**

## 📦 Deployment Process

### Environment Strategy
```
Development → Staging → Production
```

### Deployment Checklist
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance metrics validated
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Monitoring alerts configured

## 📊 Performance Guidelines

### Optimization Strategies
- **Code splitting** for route-based chunks
- **Lazy loading** for heavy components
- **Memoization** for expensive calculations
- **Virtualization** for large lists

### Performance Metrics
- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3s

## 🐛 Bug Reporting & Issue Management

### Bug Report Template
```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Navigate to...
2. Click on...
3. Observe...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: Chrome 120.0
- OS: macOS 14.0
- Device: MacBook Pro

**Screenshots**
If applicable, add screenshots
```

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority: high/medium/low`

## 🎓 Learning Resources

### Required Reading
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Recommended Learning
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [React Design Patterns](https://www.patterns.dev/)
- [Web Security Best Practices](https://owasp.org/www-project-web-security-testing-guide/)

## 👥 Team Communication

### Communication Channels
- **Slack**: Daily communication (#dev-general, #dev-frontend, #dev-backend)
- **Discord**: Community and casual chat
- **GitHub**: Technical discussions on issues/PRs
- **Zoom**: Weekly standup meetings

### Meeting Schedule
- **Daily Standup**: 9:00 AM EST (async in Slack)
- **Sprint Planning**: Every 2 weeks (Monday)
- **Retrospective**: End of each sprint (Friday)
- **Architecture Review**: Monthly (first Tuesday)

### Documentation
- **Technical Decisions**: Document in `docs/decisions/`
- **API Changes**: Update in `docs/api/`
- **Deployment Notes**: Maintain in `docs/deployment/`

## 🆘 Getting Help

### Escalation Path
1. **Search existing issues** and documentation
2. **Ask in Slack** #dev-help channel
3. **Create GitHub issue** with detailed description
4. **Schedule pairing session** if needed
5. **Team lead review** for complex issues

### Mentorship Program
New team members are paired with experienced developers for:
- Code review guidance
- Architecture discussions
- Best practices sharing
- Career development

## 📋 Checklist for New Contributors

### Before First Commit
- [ ] Development environment set up
- [ ] All tests passing locally  
- [ ] Code style configured (ESLint + Prettier)
- [ ] Git hooks configured
- [ ] Team communication channels joined
- [ ] Project documentation read

### First Week Goals
- [ ] Complete a "good first issue"
- [ ] Participate in code review
- [ ] Attend team standup
- [ ] Ask questions and get familiar with codebase
- [ ] Set up local development workflow

---

## 📞 Contact Information

**Team Lead**: [Your Name] - @username on Slack
**DevOps**: [Name] - devops@aurumvest.com  
**Security**: [Name] - security@aurumvest.com
**Support**: support@aurumvest.com

---

*Welcome to the team! We're excited to build the future of cryptocurrency trading together.* 🚀