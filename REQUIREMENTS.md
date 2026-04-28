# KisanClaim — Project Requirements

## 📋 Software Prerequisites

| Requirement     | Minimum Version | Recommended     |
|-----------------|-----------------|-----------------|
| **Node.js**     | 18.17.0         | 20.x LTS or 22.x |
| **npm**         | 9.x             | 10.x            |
| **Browser**     | Chrome 90+      | Chrome / Edge (latest) |
| **OS**          | Windows 10 / macOS 12 / Ubuntu 20.04 | Any modern OS |

> **Note:** No database, Docker, or external API keys are required. The app runs entirely offline with an in-memory data store.

---

## 📦 Dependencies

### Core Runtime
| Package             | Version   | Purpose                                  |
|---------------------|-----------|------------------------------------------|
| `next`              | 16.2.0    | React framework (App Router, Turbopack)  |
| `react`             | 19.2.4    | UI library                               |
| `react-dom`         | 19.2.4    | React DOM renderer                       |
| `typescript`        | 5.7.3     | Type-safe JavaScript                     |

### Authentication & Security
| Package      | Version | Purpose                        |
|--------------|---------|--------------------------------|
| `jose`       | ^5.9.6  | JWT creation & verification    |
| `bcryptjs`   | ^2.4.3  | Password hashing (available for future use) |

### State Management & Data Fetching
| Package | Version | Purpose                       |
|---------|---------|-------------------------------|
| `swr`   | ^2.2.5  | React data fetching & caching |

### AI / Chat SDK
| Package         | Version | Purpose                      |
|-----------------|---------|------------------------------|
| `ai`            | ^6.0.0  | Vercel AI SDK core           |
| `@ai-sdk/react` | ^3.0.0 | React hooks for AI streaming |

### UI Component Library (Radix UI)
| Package                              | Purpose           |
|--------------------------------------|-------------------|
| `@radix-ui/react-accordion`         | Accordion          |
| `@radix-ui/react-alert-dialog`      | Alert dialogs      |
| `@radix-ui/react-avatar`            | User avatars       |
| `@radix-ui/react-checkbox`          | Checkboxes         |
| `@radix-ui/react-dialog`            | Modal dialogs      |
| `@radix-ui/react-dropdown-menu`     | Dropdown menus     |
| `@radix-ui/react-label`             | Form labels        |
| `@radix-ui/react-popover`           | Popovers           |
| `@radix-ui/react-progress`          | Progress bars      |
| `@radix-ui/react-radio-group`       | Radio groups       |
| `@radix-ui/react-scroll-area`       | Custom scroll area |
| `@radix-ui/react-select`            | Select dropdowns   |
| `@radix-ui/react-separator`         | Dividers           |
| `@radix-ui/react-slider`            | Range sliders      |
| `@radix-ui/react-slot`              | Slot composition   |
| `@radix-ui/react-switch`            | Toggle switches    |
| `@radix-ui/react-tabs`              | Tab panels         |
| `@radix-ui/react-toast`             | Toast notifications|
| `@radix-ui/react-toggle`            | Toggle buttons     |
| `@radix-ui/react-toggle-group`      | Toggle groups      |
| `@radix-ui/react-tooltip`           | Tooltips           |

### Styling & Design
| Package                   | Version   | Purpose                    |
|---------------------------|-----------|----------------------------|
| `tailwindcss`             | ^4.2.0    | Utility-first CSS          |
| `@tailwindcss/postcss`    | ^4.2.0    | PostCSS integration        |
| `tw-animate-css`          | 1.3.3     | Tailwind animation classes |
| `class-variance-authority`| ^0.7.1    | Component variant styles   |
| `clsx`                    | ^2.1.1    | Conditional classnames     |
| `tailwind-merge`          | ^3.3.1    | Merge Tailwind classes     |
| `next-themes`             | ^0.4.6    | Dark/light theme support   |

### Charts & Visualization
| Package    | Version | Purpose         |
|------------|---------|-----------------|
| `recharts` | 2.15.0  | Data charts     |

### Forms & Validation
| Package               | Version | Purpose              |
|-----------------------|---------|----------------------|
| `react-hook-form`     | ^7.54.1 | Form state management|
| `@hookform/resolvers` | ^3.9.1  | Schema validation    |
| `zod`                 | ^3.24.1 | Schema declaration   |

### Utilities
| Package               | Version | Purpose                   |
|-----------------------|---------|---------------------------|
| `date-fns`            | 4.1.0   | Date formatting           |
| `lucide-react`        | ^0.564.0| Icon library              |
| `sonner`              | ^1.7.1  | Toast notification system |
| `cmdk`                | 1.1.1   | Command palette           |
| `vaul`                | ^1.1.2  | Drawer component          |
| `input-otp`           | 1.4.2   | OTP input component       |
| `embla-carousel-react`| 8.6.0   | Carousel component        |
| `react-day-picker`    | 9.13.2  | Date picker               |
| `react-resizable-panels`| ^2.1.7| Resizable panels          |

### Analytics (Optional)
| Package             | Version | Purpose            |
|---------------------|---------|-------------------|
| `@vercel/analytics` | 1.6.1   | Page view analytics (no-op locally) |

---

## 🚀 Setup & Installation

```bash
# 1. Clone or navigate to the project directory
cd Trial

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role    | Email                    | Password  |
|---------|--------------------------|-----------|
| User    | demo@kisanclaim.com      | demo123   |
| Admin   | admin@kisanclaim.com     | admin123  |
| Agent   | agent@kisanclaim.com     | agent123  |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│              Next.js 16 (App Router)        │
├──────────────┬──────────────────────────────┤
│  Frontend    │  Backend (API Routes)        │
│  React 19    │  /api/auth/*                 │
│  Tailwind 4  │  /api/plans, /api/policies   │
│  Radix UI    │  /api/claims, /api/quote     │
│  Recharts    │  /api/chat, /api/recommend   │
│  SWR         │  /api/fraud-check            │
├──────────────┴──────────────────────────────┤
│         In-Memory Data Store (sample-data)  │
│         JWT Auth (jose) via HttpOnly Cookie │
└─────────────────────────────────────────────┘
```

---

## 📂 Key Project Structure

```
Trial/
├── app/
│   ├── (main)/          # Public pages: Home, Plans, Quote, Advisor, Compare
│   ├── (auth)/          # Login & Signup pages
│   ├── (dashboard)/     # User dashboard (policies, claims, payments)
│   ├── (admin)/         # Admin panel (users, plans, claims management)
│   ├── api/             # REST API routes
│   └── globals.css      # Design tokens & theme
├── components/
│   ├── ui/              # 55+ Radix-based UI components
│   ├── home/            # Landing page sections
│   ├── layout/          # Navbar & Footer
│   └── chatbot.tsx      # AI chat assistant
├── hooks/               # useAuth, useToast, useMobile
├── lib/
│   ├── sample-data.ts   # In-memory DB with sample data
│   ├── auth.ts          # JWT token management
│   ├── constants.ts     # App constants
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
└── package.json
```

---

## ✅ Features Checklist

- [x] User authentication (Login / Signup / Logout)
- [x] JWT-based session management (HttpOnly cookies)
- [x] Insurance plans browsing & comparison
- [x] Premium quote calculator
- [x] AI-powered plan recommendations
- [x] Policy purchase flow
- [x] Claim filing & tracking
- [x] AI fraud detection scoring
- [x] Offline chatbot assistant (KisanMitra)
- [x] User dashboard with overview stats
- [x] Admin panel for management
- [x] Payment / transaction history
- [x] Responsive design (mobile + desktop)
- [x] Dark mode support
- [x] 100% offline — no external APIs or databases needed
