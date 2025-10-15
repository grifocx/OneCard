# One Index Card - ADHD Task Manager

## Overview

This is a minimalist task management application specifically designed for ADHD college students, implementing the "One Index Card" method inspired by Tim Ferriss's minimum effective dose philosophy. The app helps users focus on what matters most each day by limiting them to one "big task" and 2-3 smaller tasks, mimicking the constraint of a physical 3x5 index card.

The application features a three-page interface: Today (daily task card), Progress (streak tracking and stats), and History (past completed cards). It emphasizes visual feedback, simplicity, and the satisfaction of completing tasks with confetti celebrations when cards are "destroyed" (completed).

**Last Updated**: October 15, 2025

## User Preferences

- **Preferred Font**: IBM Plex Mono (monospace) for all text throughout the app
- **Communication Style**: Simple, everyday language
- **Design Philosophy**: Radical simplicity to minimize cognitive load for ADHD users

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
- IBM Plex Mono font for all text (monospace for clarity and focus)
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
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task (text or completion status)
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/stats/streak` - Get current and best streak statistics
- `GET /api/stats/weekly` - Get weekly task completion statistics

**Business Logic Patterns**
- Storage abstraction layer (`IStorage` interface) separating database operations from route handlers
- Card lifecycle: created automatically on first visit, can be destroyed once all tasks feel complete
- Tasks are ordered within cards (0 for big task, 1-3 for small tasks)
- Automatic card creation when accessing today's card if none exists

### Data Storage

**ORM & Database**
- Drizzle ORM for type-safe database queries and schema management
- PostgreSQL dialect configured via `@neondatabase/serverless` driver
- WebSocket-based connection pooling for serverless environments
- Database migrations handled via `npm run db:push` (no manual SQL migrations)

**Schema Design**

*Cards Table*
- `id` (varchar/UUID primary key)
- `date` (timestamp) - The day this card represents
- `destroyed` (boolean) - Whether the user has "destroyed" (completed) this card
- `createdAt` (timestamp)

*Tasks Table*
- `id` (varchar/UUID primary key)
- `cardId` (foreign key to cards, cascade delete)
- `text` (task description)
- `completed` (boolean)
- `isBigTask` (boolean) - Distinguishes the "one big thing" from smaller tasks
- `order` (integer) - Display order within the card (0 for big task, 1-3 for small tasks)
- `createdAt` (timestamp)

**Relationships**
- One-to-many: Card → Tasks (with cascade delete to remove tasks when card is deleted)
- Explicit relations defined using Drizzle's `relations` operator

**Data Validation**
- Zod schemas for request validation
- `insertCardSchema` uses `z.coerce.date()` to handle date strings from frontend
- `insertTaskSchema` validates task creation/updates

**Migration Strategy**
- Drizzle Kit for schema migrations stored in `/migrations` directory
- `npm run db:push` command to sync schema changes to database
- Never manually write SQL migrations

### External Dependencies

**Third-Party Services**
- Neon Database (PostgreSQL) - Serverless PostgreSQL database via `@neondatabase/serverless`
- Google Fonts - IBM Plex Mono for typography (loaded via CDN in HTML)

**Key Libraries**
- **Animation**: Framer Motion for component animations, canvas-confetti for celebration effects
- **Form Handling**: React Hook Form with @hookform/resolvers and Zod for validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Icons**: Lucide React for consistent icon set
- **Session Management**: Environment-based configuration (DATABASE_URL, etc.)

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
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database connection details
- `SESSION_SECRET` - Session encryption secret
- `NODE_ENV` - Determines dev vs production behavior

**Production Startup**
- `npm start` runs the compiled Express server
- Server serves static frontend files and handles API routes
- Vite middleware only active in development

## Recent Changes

### October 15, 2025
- **Full Application Build**
  - Created database schema for cards and tasks with proper Drizzle relations
  - Implemented all backend API routes for card/task CRUD operations
  - Built streak calculation logic for tracking consecutive days
  - Integrated frontend with backend APIs (replaced all mock data)
  - Fixed date validation issue in card creation schema using `z.coerce.date()`
  - Successfully tested complete user flow: creating cards, adding tasks, marking complete, viewing progress/history

- **Font Change**
  - Updated entire app to use IBM Plex Mono font instead of Inter/JetBrains Mono mix
  - Applied monospace aesthetic throughout for ADHD-friendly clarity

- **Design System**
  - Created comprehensive design guidelines focusing on ADHD-friendly UI/UX
  - Implemented calming color palette with sage green primary and soft purple accent
  - Built reusable component system: DailyCard, TaskCheckbox, StreakCounter, WeeklyCalendar, ProgressStats, HistoryCard
  - Added confetti celebration animation when cards are destroyed
  - Implemented dark mode with theme toggle

## Technical Notes

### Card & Task Lifecycle
1. User visits app → GET /api/cards/today
2. If no card exists → POST /api/cards (auto-created with today's date)
3. User types task text → onBlur → POST /api/tasks (creates task)
4. User checks checkbox → PATCH /api/tasks/:id (updates completed status)
5. User destroys card (after 6pm) → POST /api/cards/:id/destroy → confetti animation

### Streak Calculation Algorithm
- Queries all destroyed cards ordered by date descending
- For each card, checks if it has completed tasks
- Calculates consecutive day sequences
- Tracks both current streak and best streak
- Current streak starts from most recent completed day

### Performance Considerations
- React Query caching prevents unnecessary API calls
- Tasks saved on blur to reduce API requests during typing
- Efficient database queries with proper indexing on date fields
- Cascade delete ensures data integrity when removing cards

### Future Enhancement Ideas
- User authentication for multi-device sync
- Customizable daily reset time (for night owls)
- Optional reminder notifications
- Weekly reflection feature
- Theme customization options
