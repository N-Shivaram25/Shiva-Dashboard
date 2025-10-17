# Daily Wellness & Productivity Tracker

## Overview

This is a personal wellness and productivity tracking application that helps users monitor their daily activities across multiple dimensions: goals, tasks, thoughts (both positive and negative), energy levels, wellness activities, communication tasks, entertainment, and document management. The application provides a day-by-day tracking interface with data persistence, following a clean, utility-focused design inspired by Notion, Todoist, and Linear.

## Recent Changes

**October 17, 2025** - Upgraded file storage to Cloudinary for production deployment:
- Integrated Cloudinary for cloud-based file and image storage
- Replaced base64 database storage with Cloudinary URLs and public IDs
- Implemented proper Cloudinary asset deletion on record removal (no storage leaks)
- Added file upload security: 10MB size limit, MIME type validation
- Environment variable validation at startup for Cloudinary credentials
- Production-ready deployment for Vercel/Render with persistent file storage

**October 8, 2025** - Added comprehensive College Documents management system with:
- Main Docs dashboard with sections for College Documents, Internships, Certifications, and Links
- College Documents page with category-based organization (10th Marks, Aadhaar Card, etc.)
- Internships page with multi-file upload support (offer letters, completion certificates, other files)
- Certifications page for professional certificates
- Links page for important document-related URLs
- Full CRUD operations for all document types

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)

**State Management Approach**
- Local state management using React hooks (useState, useContext)
- Custom `DateContext` for global date selection across all pages
- `useLocalStorage` custom hook for data persistence
- `@tanstack/react-query` for future server data synchronization
- No centralized state management (Redux/Zustand) - component-level state with context for shared concerns

**UI Component System**
- **shadcn/ui** component library based on Radix UI primitives
- Custom theme system with CSS variables for light/dark mode
- Tailwind CSS for utility-first styling
- Design tokens defined in `design_guidelines.md` and `client/src/index.css`
- Component organization: reusable UI components in `components/ui/`, feature components in `components/`

**Routing Strategy**
- Page-based routing with dedicated pages for each tracking category
- Overview page showing aggregated statistics
- All routes wrapped in shared layout with sidebar navigation and date selector
- Routes: `/` (overview), `/goals`, `/tasks`, `/thoughts`, `/energy`, `/wellness`, `/communication`, `/entertainment`

### Backend Architecture

**Server Framework**
- **Express.js** as the HTTP server
- Development setup with Vite middleware for HMR
- Currently using in-memory storage (`MemStorage` class) as a placeholder
- Prepared for database integration with storage interface pattern

**API Design Pattern**
- RESTful API structure ready (routes registered through `server/routes.ts`)
- Storage abstraction through `IStorage` interface for easy backend swapping
- Middleware for request logging and error handling
- Session support prepared with `connect-pg-simple`

**Data Persistence Strategy**
- **Current**: Client-side localStorage for immediate data persistence
- **Planned**: PostgreSQL database with Drizzle ORM
- Schema definitions in `shared/schema.ts` prepared for database migration
- Dual storage approach allows offline-first functionality while preparing for server sync

### Data Storage Solutions

**Database Schema (Prepared)**
- PostgreSQL as the target database (Neon serverless)
- **Drizzle ORM** for type-safe database queries
- Schema includes tables for: `goals`, `tasks`, `negative_thoughts`, `positive_thoughts`, `energy_logs`, `wellness_logs`, `communications`, `entertainment`
- Each table has: UUID primary key, date field (text), content fields, and optional completion status
- Migration system configured through `drizzle-kit`

**Current Data Model**
- Date-based partitioning (entries stored with ISO date string)
- Each data type has its own interface defined in `client/src/lib/dataStore.ts`
- Helper functions: `generateId()`, `getDateString()`, `filterByDate()` for consistent data handling
- localStorage keys match future table names for easy migration

**Design Rationale**
- Started with localStorage for rapid development and offline capability
- Database schema pre-defined to ensure smooth transition
- Storage interface pattern allows swapping implementations without changing application logic

### Authentication and Authorization

**Current State**
- No authentication implemented
- Single-user application design
- User schema exists in database preparation (`shared/schema.ts`) but unused

**Future Considerations**
- Prepared for session-based authentication (express-session + connect-pg-simple)
- User model exists with username field for multi-user expansion
- Currently stateless - all data accessible without authentication

### Design System

**Color Palette**
- Light mode: Clean white backgrounds with subtle gray surfaces
- Dark mode: Deep blue-gray backgrounds with proper contrast
- Semantic colors: Primary (calming blue), Success (green), Warning (amber), Accent (purple for wellness)
- CSS custom properties in HSL format for dynamic theme switching

**Typography**
- Primary font: Inter (Google Fonts) for UI text
- Monospace: JetBrains Mono for data/numbers
- Consistent scale: text-xs to text-3xl
- Font weights: 400 (normal) to 700 (bold)

**Component Patterns**
- Card-based layouts for all content sections
- Consistent spacing: Tailwind units (2, 4, 6, 8, 12, 16)
- Icon-first navigation with Lucide icons
- Form patterns: inline add forms with immediate feedback
- Checkbox/toggle patterns for completable items

## External Dependencies

### Third-Party UI Libraries
- **Radix UI** primitives (@radix-ui/*): Accessible, unstyled component primitives for dialogs, dropdowns, tooltips, etc.
- **shadcn/ui**: Pre-built component library built on Radix UI with customizable styling
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component (prepared but not actively used)
- **embla-carousel-react**: Carousel component for potential future use

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL client optimized for serverless environments
- **Drizzle ORM**: Type-safe ORM with zod schema integration
- **drizzle-zod**: Integration between Drizzle and Zod for runtime validation

### File Storage & Upload
- **Cloudinary**: Cloud-based file and image storage service
- **Multer**: File upload middleware with size/type validation (10MB limit)
- Supported file types: Images (JPEG, PNG, GIF, WebP), PDF, Word, Excel
- Files stored with secure URLs and public IDs for proper deletion management

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx** & **tailwind-merge**: Conditional className composition
- **class-variance-authority**: Type-safe variant styling for components
- **nanoid**: Unique ID generation (imported but using custom generateId)

### Development Tools
- **TypeScript**: Type safety across entire codebase
- **Vite**: Fast development server with HMR
- **ESBuild**: Production bundling for server code
- **PostCSS** with **Autoprefixer**: CSS processing

### Form Management
- **React Hook Form**: Prepared for complex form handling
- **@hookform/resolvers**: Zod integration for form validation
- **Zod**: Runtime type validation and schema definition

### Query Management
- **@tanstack/react-query**: Prepared for server state management and caching
- Currently configured but not actively fetching (using localStorage)

### Replit-Specific Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development navigation helper
- **@replit/vite-plugin-dev-banner**: Development environment banner