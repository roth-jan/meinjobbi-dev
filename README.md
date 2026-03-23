# Ntc.Jobbi.ReactApp

A modern Next.js frontend for the Jobbi job portal - connecting students with apprenticeship opportunities.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | Mantine | 8.x |
| State Management | Zustand | 5.x |
| Language | TypeScript | 5.x |
| Icons | Tabler Icons | 3.x |
| Carousel | Embla Carousel | 8.x |
| Linting/Formatting | Biome | 2.x |
| Testing | Playwright | 1.x |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd Ntc.Jobbi.ReactApp
npm install
```

### Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

### Running the App

```bash
# Connect to local backend (http://localhost:5027)
npm run dev:local

# Connect to DEV API
npm run dev:aws-dev

# Connect to DEMO API
npm run dev:aws-demo

# Default (uses .env.local)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (main)/                 # Route group with MainLayout
│   │   ├── faq/                # FAQ page
│   │   ├── home/               # Home page with carousel
│   │   └── layout.tsx          # Layout with sidebar
│   ├── actions/                # Server Actions for API calls
│   │   ├── companyActions.ts
│   │   ├── jobAdActions.ts
│   │   ├── studentActions.ts
│   │   ├── userActions.ts
│   │   └── werbungActions.ts
│   ├── login/                  # Login & Registration
│   │   ├── forms/              # Multi-step registration forms
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout with Mantine provider
│   └── page.tsx                # Landing page
├── components/
│   ├── auth/                   # AuthGuard for protected routes
│   ├── layout/                 # MainLayout, Sidebar, Footer
│   └── ui/                     # Reusable UI (ActionCard)
├── functions/                  # Client-side services
│   └── authService.ts          # Cognito authentication
├── lib/                        # Utilities
│   ├── auth.ts                 # Auth helpers
│   ├── fetchWrapper.ts         # API client with auth handling
│   └── theme.ts                # Mantine theme configuration
├── stores/                     # Zustand state stores
│   ├── authStore.ts            # Authentication state
│   └── uiStore.ts              # UI state (sidebar, etc.)
├── types/                      # TypeScript definitions
│   ├── api.ts
│   ├── company.ts
│   ├── jobAd.ts
│   ├── student.ts
│   ├── user.ts
│   └── werbung.ts
tests/                          # Playwright E2E tests
├── register-over16.spec.ts
└── register-under16.spec.ts
```

## Registration Flow

The app supports a multi-step registration process:

### Over 16 Years Old
1. **Registration Form** - Email, username, personal info, password
2. **Interests** - Select up to 3 interests/strengths
3. **Code Verification** - Enter code sent to student's email
4. **Success** - Registration complete

### Under 16 Years Old
1. **Registration Form** - Same as above
2. **Interests** - Select up to 3 interests/strengths
3. **Parental Consent** - Enter guardian's email address
4. **Code Verification** - Enter code sent to guardian's email
5. **Success** - Registration complete

## Available Scripts

### Development
```bash
npm run dev           # Start dev server (default env)
npm run dev:local     # Connect to local backend
npm run dev:aws-dev   # Connect to DEV API
npm run dev:aws-demo  # Connect to DEMO API
```

### Code Quality
```bash
npm run lint          # Run Biome linter
npm run format        # Format code with Biome
npm run check         # Run lint + format
npm run type-check    # TypeScript type checking
```

### Testing
```bash
npm run test          # Run all Playwright tests
npm run test:ui       # Run tests with Playwright UI
npm run test:over16   # Test registration (over 16)
npm run test:under16  # Test registration (under 16)
```

### Production
```bash
npm run build         # Build for production
npm run start         # Start production server
```

## Key Patterns

### State Management (Zustand)

```tsx
import { useAuthStore, useUser, useIsAuthenticated } from '@/stores';

function MyComponent() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { login, logout } = useAuthStore();
}
```

### Server Actions

API calls use Next.js Server Actions:

```tsx
import { getJobAds, getJobAdById } from '@/app/actions';

// In a Server Component or with useEffect
const jobs = await getJobAds();
const job = await getJobAdById(123);
```

### Protected Routes

```tsx
import { AuthGuard } from '@/components';

function ProtectedPage() {
  return (
    <AuthGuard>
      {/* Protected content */}
    </AuthGuard>
  );
}
```

### Route Groups

The `(main)` route group applies `MainLayout` (with sidebar) to pages:
- `/home` - Home page
- `/faq` - FAQ page

Pages outside the group (like `/login`) use different layouts.

## Testing with Playwright

Tests automate the registration flow:

```bash
# Install Playwright browsers (first time)
npx playwright install chromium

# Run tests (browser stays open for 10 min for manual inspection)
npm run test:over16
npm run test:under16
```

### DEV Mode Features

In development mode, certain forms have "DEV: Skip" buttons to speed up testing. These are automatically removed in production builds.

## API Environments

| Environment | API URL |
|-------------|---------|
| Local | `http://localhost:5027` |
| DEV | `https://mxbxwlreif.execute-api.eu-central-1.amazonaws.com/default` |
| DEMO | `https://3rwgghvo8d.execute-api.eu-central-1.amazonaws.com/demo` |

## Deployment

The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **AWS Elastic Beanstalk**
- Any platform supporting Node.js

```bash
npm run build
npm run start
```
