# One Index Card - ADHD Task Manager

## Overview

This is a minimalist task management application specifically designed for ADHD users, implementing the "One Index Card" method inspired by Tim Ferriss's minimum effective dose philosophy. The app helps users focus on what matters most each day by limiting them to one "big task" and 2-3 smaller tasks, mimicking the constraint of a physical 3x5 index card.

The application features a three-page interface: Today (daily task card), Progress (streak tracking and stats), and History (past completed cards). It emphasizes visual feedback, simplicity, and the satisfaction of completing tasks with confetti celebrations when cards are "destroyed" (completed).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (three main routes: /, /progress, /history)

**State Management**
- TanStack Query (React Query) for server state management, data fetching, and caching
- Local component state with React hooks for UI interactions
- No global state management library needed due to simple data flow

**UI Component System**
- Shadcn/ui design system with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Dark mode support with theme toggle stored in localStorage
- Custom CSS variables for theming (defined in index.css with light/dark mode variants)

**Design Philosophy**
- "Radical simplicity" to minimize cognitive load for ADHD users
- Calming color palette: sage green for success (142 76% 36%), soft purple for streaks (262 52% 47%)
- IBM Plex Mono font for monospace elements (streaks/stats)
- Visual feedback system: confetti animations on card completion, hover/active elevation states

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- REST API endpoints following pattern `/api/{resource}`
- Middleware for request logging and error handling
- Development-only Vite integration for HMR during development

**API Endpoints**
- `GET /api/cards/today` - Fetch or create today's card
- `GET /api/cards/history` - Fetch cards within date range (default: last 30 days)
- `POST /api/cards` - Create new card
- `POST /api/cards/:id/destroy` - Mark card as destroyed (completed)
- Task CRUD operations under `/api/tasks/*`
- Stats endpoints for streak and weekly statistics

**Business Logic Patterns**
- Storage abstraction layer (`IStorage` interface) separating database operations from route handlers
- Card lifecycle: created automatically on first visit, can be destroyed once all tasks feel complete
- Tasks are ordered within cards (0 for big task, 1-3 for small tasks)

### Data Storage

**ORM & Database**
- Drizzle ORM for type-safe database queries and schema management
- PostgreSQL dialect configured via `@neondatabase/serverless` driver
- WebSocket-based connection pooling for serverless environments

**Schema Design**

*Cards Table*
- `id` (UUID primary key)
- `date` (timestamp) - The day this card represents
- `destroyed` (boolean) - Whether the user has "destroyed" (completed) this card
- `createdAt` (timestamp)

*Tasks Table*
- `id` (UUID primary key)
- `cardId` (foreign key to cards, cascade delete)
- `text` (task description)
- `completed` (boolean)
- `isBigTask` (boolean) - Distinguishes the "one big thing" from smaller tasks
- `order` (integer) - Display order within the card
- `createdAt` (timestamp)

**Relationships**
- One-to-many: Card → Tasks (with cascade delete to remove tasks when card is deleted)

**Migration Strategy**
- Drizzle Kit for schema migrations stored in `/migrations` directory
- `npm run db:push` command to sync schema changes to database

### External Dependencies

**Third-Party Services**
- Neon Database (PostgreSQL) - Serverless PostgreSQL database via `@neondatabase/serverless`
- Google Fonts - IBM Plex Mono for typography (loaded via CDN in HTML)

**Key Libraries**
- **Animation**: Framer Motion for component animations, canvas-confetti for celebration effects
- **Form Handling**: React Hook Form with @hookform/resolvers and Zod for validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Icons**: Lucide React for consistent icon set
- **Session Management**: connect-pg-simple (for PostgreSQL-backed sessions if needed)

**Development Tools**
- Replit-specific plugins: runtime error modal, cartographer (file mapping), dev banner
- tsx for TypeScript execution in development
- esbuild for production server bundling

### Deployment Considerations

**Build Process**
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server to `dist/index.js` with external packages
- Static assets served from built frontend in production

**Environment Variables**
- `DATABASE_URL` (required) - PostgreSQL connection string
- `NODE_ENV` - Determines dev vs production behavior

**Production Startup**
- `npm start` runs the compiled Express server
- Server serves static frontend files and handles API routes
- Vite middleware only active in development