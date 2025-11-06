# New-UI Project Overview

## Project Identity
- **Name**: New-UI-main
- **Type**: React + TypeScript + Vite Web Application
- **Domain**: Cryptocurrency Exchange Platform
- **Language**: TypeScript
- **Framework**: React 18.3.1 with Vite 5.4.2

## Tech Stack
**Frontend Core:**
- React 18.3.1 + React DOM 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2 (build tool)

**Styling:**
- TailwindCSS 3.4.1
- PostCSS 8.4.35 + Autoprefixer

**UI Components:**
- lucide-react ^0.344.0 (icon library)

**Backend Integration:**
- @supabase/supabase-js ^2.57.4

**Development Tools:**
- ESLint 9.9.1 with TypeScript support
- React Hooks linting plugin
- TypeScript strict mode

## Project Structure
```
src/
├── App.tsx                          # Main app component with routing
├── main.tsx                         # Entry point
├── index.css                        # Global styles
├── components/
│   ├── AccountCreation.tsx          # User registration
│   ├── Layout.tsx                   # App layout wrapper
│   ├── ModeToggle.tsx               # HODL/Trade mode switcher
│   ├── Navigation.tsx               # Navigation bar
│   ├── WalletTransfer.tsx           # Wallet operations
│   ├── hodl/
│   │   ├── AssetChart.tsx          # Asset visualization
│   │   └── HodlDashboard.tsx       # Portfolio view
│   └── trade/
│       ├── OrderBook.tsx           # Trading order book
│       ├── OrderPanel.tsx          # Order placement
│       ├── TradeDashboard.tsx      # Trading interface
│       └── TradingChart.tsx        # Price charts
├── contexts/
│   └── AppContext.tsx              # Global state management
└── types/
    └── index.ts                    # TypeScript definitions
```

## Application Architecture

### State Management
**AppContext** provides centralized state with:
- User authentication state
- Dual-mode support (HODL vs TRADE)
- Asset management (separate hodlAssets and tradeAssets)
- Order tracking and transaction history
- Current trading pair management

### Core Types
```typescript
User: id, email, isKycVerified, is2faEnabled, country, createdAt
Asset: symbol, name, logo, balance, value, change24h, price
Transaction: type, asset, amount, value, status, timestamp
Order: pair, type, side, amount, price, filled, status
AppMode: 'hodl' | 'trade'
```

### Application Modes
1. **HODL Mode** - Portfolio management and long-term holding
   - AssetChart: Visual asset tracking
   - HodlDashboard: Portfolio overview

2. **TRADE Mode** - Active trading interface
   - TradingChart: Real-time price charts
   - OrderBook: Market depth visualization
   - OrderPanel: Order placement and management
   - TradeDashboard: Comprehensive trading view

## Key Features
- Dual-mode cryptocurrency platform (HODL/TRADE)
- User account creation with KYC support
- 2FA authentication capability
- Wallet transfers and asset management
- Order book visualization
- Trading chart integration
- Transaction history tracking
- Responsive UI with TailwindCSS

## Development Scripts
```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
npm run typecheck # TypeScript validation
```

## Configuration Files
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript base config
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node-specific TypeScript config
- `tailwind.config.js` - TailwindCSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint rules

## Project Status
- **Initialized**: Active development
- **Backend**: Supabase integration configured
- **State**: AppContext with reducer pattern
- **UI**: Component structure established
- **Styling**: TailwindCSS + custom styling ready
