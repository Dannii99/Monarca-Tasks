# Architecture — Monarca Tasks

## 1. Project Context

Monarca Tasks is a single-user personal Kanban task manager. The user has tasks scattered across multiple tools and needs one synced place to manage work, home, and personal commitments. Deployed on Vercel with Neon PostgreSQL.

**Sources of truth:**
- `opencode/project-context.md` — product requirements, MVP scope, user flows, business rules
- `opencode/ui-visual-guidelines.md` — visual design system from Stitch design ID 17997651674137774989

## 2. Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 + CSS custom properties for design tokens + ui.shadcn |
| Font | Inter (via next/font/google) |
| Icons | Lucide React |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | NextAuth v5 (Credentials provider, single user) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Deploy | Vercel |

## 3. Folder Structure

```
monarca-tasks/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── (board)/
│   │   ├── layout.tsx                # Auth-protected layout
│   │   └── page.tsx                  # Main Kanban board (server component)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth handler
│   │   └── tasks/
│   │       ├── route.ts              # GET all, POST create
│   │       └── [id]/
│   │           ├── route.ts          # GET, PATCH, DELETE single task
│   │           └── move/
│   │               └── route.ts      # PATCH status change
│   ├── layout.tsx                    # Root layout (fonts, global styles)
│   └── globals.css                   # Design tokens, Tailwind imports
├── components/
│   ├── ui/                           # Reusable primitives
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── select.tsx
│   │   └── skeleton.tsx
│   ├── board/                        # Kanban board feature
│   │   ├── board.tsx                 # Board container (client)
│   │   ├── column.tsx                # Single column (client)
│   │   ├── task-card.tsx             # Task card (client)
│   │   ├── task-form.tsx             # Create/edit form (client)
│   │   ├── task-form-modal.tsx       # Modal wrapper for form
│   │   ├── board-toolbar.tsx         # Search, filter, sort controls
│   │   └── empty-state.tsx           # Empty column message
│   └── auth/
│       └── login-form.tsx            # Login form component
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # NextAuth config
│   ├── utils.ts                      # Shared utilities (cn, date helpers)
│   └── constants.ts                  # Categories, priorities, statuses
├── types/
│   └── task.ts                       # Task TypeScript types
├── prisma/
│   └── schema.prisma                 # Database schema
├── opencode/
│   ├── project-context.md
│   └── ui-visual-guidelines.md
├── AGENTS.md
├── architecture.md                   # This file
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── package.json
```

## 4. Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("TODO")    // TODO, IN_PROGRESS, DONE
  category    String    @default("PERSONAL") // WORK, HOME, PERSONAL
  priority    String    @default("MEDIUM")   // HIGH, MEDIUM, LOW
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## 5. Component Hierarchy

```
RootLayout
└── AuthProvider (NextAuth SessionProvider)
    └── (board)/layout.tsx (auth check)
        └── (board)/page.tsx (server: fetches tasks)
            └── Board (client: dnd-kit context)
                ├── BoardToolbar
                │   ├── SearchInput
                │   ├── CategoryFilter
                │   └── SortSelect
                └── KanbanColumns
                    ├── Column (TODO)
                    │   ├── ColumnHeader (with count)
                    │   └── TaskCard[] (sortable)
                    ├── Column (IN_PROGRESS)
                    │   ├── ColumnHeader
                    │   └── TaskCard[]
                    └── Column (DONE)
                        ├── ColumnHeader
                        └── TaskCard[]
```

## 6. API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/tasks` | List all tasks (with optional query params for filter/sort/search) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/[id]` | Get single task |
| PATCH | `/api/tasks/[id]` | Update task fields |
| DELETE | `/api/tasks/[id]` | Delete task |
| PATCH | `/api/tasks/[id]/move` | Change task status (column move) |
| POST | `/api/auth/[...nextauth]` | NextAuth login handler |

All task routes require authentication via NextAuth session check.

## 7. Authentication Approach

- **NextAuth v5** with Credentials provider
- Single user: email + password stored in database
- Password hashed with bcrypt
- Session stored in JWT (no database session needed)
- Login page at `/login`
- All board pages protected by middleware or server-side session check
- Session duration: 30 days (remember me)

## 8. Design Token Mapping

CSS custom properties in `globals.css` map to the visual guidelines:

```css
:root {
  /* Category colors */
  --color-work: #2563eb;
  --color-home: #10b981;
  --color-personal: #8b5cf6;

  /* Surfaces */
  --color-bg: #f8f9fa;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;

  /* Text */
  --color-text-primary: #191c1d;
  --color-text-secondary: #434655;

  /* States */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ba1a1a;
  --color-active: #0053db;

  /* Spacing base: 4px */
  /* Typography: Inter */
  /* Border radius: 4px (rectangular), 9999px (pills) */
}
```

## 9. Implementation Phases

### Phase 1: Foundation
- Install dependencies: prisma, @prisma/client, next-auth@beta, bcrypt, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, lucide-react, clsx, tailwind-merge
- Set up Prisma schema and initial migration
- Configure NextAuth with Credentials provider
- Create root auth middleware
- Set up design tokens in globals.css
- Create UI primitive components (Button, Badge, Card, Input, Modal, Skeleton)

### Phase 2: Auth & Login
- Build login page and form
- Implement password hashing and verification
- Protect board routes

### Phase 3: Task API
- Implement all task API routes (CRUD + move)
- Add query parameter support for search, filter, sort
- Add authentication middleware to all task routes

### Phase 4: Kanban Board
- Build board container with dnd-kit
- Build column components with headers and counts
- Build task card components with category badges, priority indicators, overdue styling
- Implement drag-and-drop between columns
- Implement optimistic UI updates for moves

### Phase 5: Toolbar & Interactions
- Build search input with real-time filtering
- Build category filter tabs
- Build sort dropdown
- Build task form modal (create + edit)
- Build delete confirmation
- Build empty states

### Phase 6: Polish & Responsive
- Mobile responsive layout (stacked columns)
- Loading states and skeletons
- Error states and toast notifications
- Smooth animations for drag/drop
- Accessibility pass (keyboard navigation, ARIA labels, focus management)
- Visual polish per ui-visual-guidelines.md

## 10. Key Technical Decisions

- **Server component for board page**: Initial task fetch happens server-side for fast first paint
- **Client components for interactivity**: Board, columns, cards, and forms are client components for dnd-kit and form state
- **Optimistic updates**: Task moves update UI immediately, then sync to API
- **Client-side search/filter**: For <1000 tasks, client-side filtering is fast enough and avoids API round trips
- **No localStorage**: All data flows through API → Prisma → PostgreSQL
- **Single user**: No multi-tenancy, no user switching, no registration flow

## 11. Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
APP_PASSWORD="user-defined-password"
```

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| dnd-kit complexity on mobile | Use touch-friendly drop zones, test on mobile early |
| NextAuth v5 beta stability | Pin exact version, have fallback auth ready |
| Neon cold starts | Acceptable for personal app; document in README |
| Over-engineering | Stick to MVP scope; no stats view, no recurring tasks in v1 |


## Relevant Skills

Use relevant skills when helpful:

- clean-code
- frontend-architecture
- ui-ux-polish
- accessibility-a11y
- performance-review
- documentation-writer