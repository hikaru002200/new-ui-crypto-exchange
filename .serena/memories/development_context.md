# Development Context

## Current Session Information
- **Working Directory**: C:\project\New-UI-main
- **Project Type**: React + TypeScript + Vite
- **Platform**: Windows (win32)
- **Date**: 2025-11-06
- **Git Status**: Not a git repository

## Development Environment
- **Build Tool**: Vite 5.4.2 (fast HMR, optimized builds)
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with React Hooks validation
- **Styling**: TailwindCSS with PostCSS pipeline

## Code Patterns & Conventions

### Component Structure
- Functional components with TypeScript
- React Hooks for state management
- Context API for global state (AppContext)
- Props interfaces defined explicitly

### State Management Pattern
```typescript
// Reducer pattern in AppContext
appReducer(state: AppState, action: AppAction): AppState
useApp() hook for context consumption
```

### File Organization
- Components by feature (hodl/, trade/)
- Shared components in root components/
- Single types file for all interfaces
- Context providers in contexts/

### Naming Conventions
- PascalCase for components
- camelCase for functions/variables
- Interface prefixes (none - direct names)
- Type exports from types/index.ts

## Dependencies & Integration

### External Services
- **Supabase**: Backend-as-a-Service integration
  - Authentication
  - Database operations
  - Real-time subscriptions (potential)

### UI Libraries
- **lucide-react**: Icon system
  - Consistent icon styling
  - Tree-shakable imports

### Build Considerations
- Vite's fast refresh enabled
- TypeScript type checking separate from build
- ESLint integration for quality gates
- TailwindCSS JIT compilation

## Known Patterns

### Authentication Flow
- User state in AppContext
- KYC verification tracking
- 2FA capability built-in

### Mode Switching
- AppMode type: 'hodl' | 'trade'
- Separate asset arrays per mode
- ModeToggle component for switching

### Asset Management
- Dual asset tracking (hodl/trade)
- Real-time balance tracking
- Price change monitoring (change24h)

### Trading Features
- Order placement and tracking
- Order book visualization
- Transaction history
- Trading pair management

## Development Workflow Recommendations

### Before Making Changes
1. Check AppContext for state implications
2. Verify type definitions in types/index.ts
3. Consider mode-specific behavior (hodl vs trade)
4. Review existing component patterns

### Testing Approach
- TypeScript validation: `npm run typecheck`
- Linting: `npm run lint`
- Local testing: `npm run dev`
- Build verification: `npm run build`

### Quality Gates
1. TypeScript compilation success
2. ESLint validation pass
3. Component render verification
4. State management integrity

## Project Health Indicators
- ✅ TypeScript strict mode enabled
- ✅ Modern React patterns (hooks, context)
- ✅ Proper separation of concerns
- ✅ Type-safe state management
- ⚠️ No git repository initialized
- ℹ️ Backend integration via Supabase

## Next Session Considerations
- Git initialization recommended for version control
- Consider environment variables for Supabase config
- Test coverage could be established
- Component documentation could be enhanced
