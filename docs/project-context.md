# Project Context — Monarca Tasks

## 1. Project Summary

Monarca Tasks is a **single-user personal task manager** designed to consolidate all of a developer’s personal and work commitments into one place. It presents tasks as a Kanban board with three columns (To Do, In Progress, Done) and allows organizing tasks by category, priority, and due date. The app is deployed on Vercel and stores data in a cloud PostgreSQL database (Neon), ensuring the same tasks are accessible from both mobile and desktop browsers.

This project is also a **portfolio piece** intended to demonstrate fullstack application development skills: a React frontend, Next.js API routes, Prisma ORM, PostgreSQL on Neon, and deployment on Vercel.

## 2. Problem Statement

The user currently tracks pending tasks across multiple disconnected tools — phone notes, WhatsApp messages, calendar reminders, Jira, and other apps. None of these tools talk to each other. The result is constant context switching, duplicated effort, and tasks falling through the cracks. There is no single source of truth for what needs to be done.

The user needs a **single, simple, always-synced place** to see and manage all personal and work commitments without the overhead of complex project management tools.

## 3. Target Users

- **Primary user**: The developer themselves.
- This is explicitly a **single-user personal productivity app**, not a SaaS product or team collaboration tool.
- The user accesses the app from both mobile and desktop browsers and expects the same data on both.

## 4. Value Proposition

- **One source of truth**: All tasks in one place, regardless of whether they are work, home, or personal.
- **Always synced**: Cloud database means tasks are accessible from any device without manual syncing.
- **Simple enough to use daily**: No complex setup, no maintenance burden, no features that get in the way.
- **Kanban visualization**: Immediate visual understanding of what is pending, what is in progress, and what is done.
- **Smart organization**: Filter by category, sort by priority or date, and find tasks instantly with real-time search.
- **Overdue awareness**: Visual cues when tasks pass their due date so nothing is forgotten.

## 5. MVP Objective

The smallest useful version of Monarca Tasks is a **single-user Kanban board** that allows the user to create, edit, move, and delete tasks organized by status, category, and priority, with due dates and search/filter capabilities, all persisted in a cloud database and accessible from any device.

## 6. MVP Scope

### Must Have

- **Kanban board** with three columns: To Do, In Progress, Done.
- **Task CRUD**: Create, read, update, and delete tasks.
- **Task attributes**:
  - Title (required)
  - Description (optional)
  - Status (To Do, In Progress, Done)
  - Category (Work, Home, Personal)
  - Priority (High, Medium, Low)
  - Due date (optional)
- **Drag-and-drop or equivalent** to move tasks between columns.
- **Category filter**: Show only tasks from Work, Home, or Personal.
- **Sorting**: By due date, priority, or task name.
- **Real-time search**: Filter tasks by typing in a search field.
- **Overdue visual indicators**: Clear visual distinction when a task’s due date has passed.
- **Mobile-responsive UI**: Fully usable on a mobile browser.
- **Cloud persistence**: All data stored in a real database (Neon PostgreSQL), not localStorage.
- **Basic data protection**: Simple authentication sufficient to prevent unauthorized access to the user’s data.

### Should Have

- Task count displayed per column.
- Default sorting that surfaces high-priority and overdue tasks first.
- Confirmation before deleting a task.
- Empty states for each column when no tasks exist.
- Smooth animations when moving tasks between columns.

### Could Have

- Dark mode toggle.
- Quick-add templates for common task types.
- Simple statistics view (e.g., tasks completed this week).
- Recurring task support.
- Keyboard shortcuts for power users.

### Out of Scope

- Multi-user support or team collaboration.
- Comments, attachments, or file uploads.
- Email or push notifications.
- Complex authentication (OAuth, SSO, multi-factor auth).
- Labels or tags beyond the three predefined categories.
- Time tracking or effort estimation.
- Calendar integration or import/export from other tools.
- localStorage as the primary data store.
- Subscription billing or paid features.

## 7. Main User Flows

### Flow 1: Adding a new task
1. User clicks a button to add a new task.
2. A form opens asking for title, description, category, priority, and due date.
3. User fills the form and saves.
4. The new task appears in the "To Do" column.

### Flow 2: Managing tasks on the Kanban board
1. User sees all tasks organized in three columns.
2. User drags (or uses an equivalent interaction) a task from "To Do" to "In Progress" when starting it.
3. User moves the task to "Done" when completed.
4. Changes are saved immediately and visible on all devices.

### Flow 3: Finding a specific task
1. User types a keyword in the search field.
2. The board instantly filters to show only matching tasks across all columns.
3. User can clear the search to see all tasks again.

### Flow 4: Reviewing overdue work
1. User opens the app and sees visual alerts on tasks that have passed their due date.
2. User may filter by category to focus on, for example, only overdue work tasks.
3. User sorts by due date to see the oldest overdue items first.

### Flow 5: Editing or removing a task
1. User opens a task to edit its title, description, category, priority, or due date.
2. User saves changes, and the board updates immediately.
3. Alternatively, user deletes a task after confirming the action.

## 8. Functional Requirements

1. The system must allow creating a task with a title, optional description, category, priority, and optional due date.
2. The system must display tasks in a Kanban board with three columns: To Do, In Progress, Done.
3. The system must allow changing a task’s status by moving it between columns.
4. The system must allow editing all task attributes after creation.
5. The system must allow deleting tasks with a confirmation step.
6. The system must provide a search field that filters tasks in real time by title or description.
7. The system must allow filtering tasks by category (Work, Home, Personal).
8. The system must allow sorting tasks by due date, priority level, or name.
9. The system must visually indicate when a task is overdue.
10. The system must persist all data in a cloud database so it is accessible from any device.
11. The system must require authentication before allowing access to task data.
12. The system must be fully functional on both mobile and desktop browsers.

## 9. Business Rules

- A task must always have a title; all other fields are optional.
- Every new task starts in the "To Do" column unless specified otherwise.
- Categories are fixed to three options: Work, Home, Personal. The user cannot create custom categories.
- Priority levels are fixed to High, Medium, Low.
- A task is considered overdue if its due date is earlier than the current date and its status is not Done.
- Search should match against both task titles and descriptions.
- Filters and search can be combined (e.g., show only Work tasks that match a search term).
- There is exactly one user account. No registration or invitation flows are needed beyond the initial setup.

## 10. Content Requirements

### Labels and UI Copy
- App name: Monarca Tasks
- Column headers: To Do, In Progress, Done
- Category labels: Work, Home, Personal
- Priority labels: High, Medium, Low
- Action buttons: Add Task, Edit, Delete, Save, Cancel, Search
- Filter labels: All Categories, Work, Home, Personal
- Sort options: Due Date, Priority, Name
- Empty state messages for each column (e.g., "No tasks yet. Add one to get started.")
- Delete confirmation message: "Are you sure you want to delete this task? This action cannot be undone."
- Overdue indicator label or tooltip

### Pages / Views
- Main Kanban board view (default)
- Task creation / edit modal or form
- Optional: simple statistics or dashboard view (could-have)

## 11. Success Criteria

- The user can add a task in under 10 seconds.
- The user can move a task between columns with a single interaction.
- The user can find any task within 5 seconds using search.
- The app loads the Kanban board in under 2 seconds on a desktop browser.
- The app is fully usable on a mobile browser without horizontal scrolling.
- All task data persists after refreshing the browser or switching devices.
- Overdue tasks are visually distinct within 1 second of loading the board.
- The portfolio demonstrates a complete fullstack flow: frontend → API → database → deployment.

## 12. Assumptions

- The user is the only person who will ever use this app; no multi-tenancy is required.
- A simple authentication mechanism (e.g., a single password or PIN) is sufficient to protect the data.
- "Overdue alerts" means visual indicators on the Kanban board, not push or email notifications.
- The number of tasks will remain small enough (likely under 1,000) that client-side search and filtering will perform well.
- The user has or will create a Neon PostgreSQL database and a Vercel account for deployment.
- The user will manage their own database connection string and any required environment variables.
- No offline support is needed; the app requires an internet connection to function.

## 13. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Single-user auth is too simple and could be bypassed | Medium | Use a strong password, consider HTTP Basic Auth or a simple session secret, and ensure the database is not publicly accessible |
| Neon free tier limits (compute hours, database size) | Low | Monitor usage; the task volume is expected to be very low |
| Mobile browser performance with many tasks | Low | Implement virtual scrolling or pagination if task count grows unexpectedly |
| Losing interest in maintaining the app after portfolio is done | High (for long-term use) | Keep the codebase simple and well-documented so it remains easy to revisit |
| Over-engineering the portfolio piece with unnecessary features | Medium | Strictly adhere to the MVP scope and resist adding features not in the must-have list |
| Dependency on external services (Neon, Vercel) free tiers | Low | Both offer generous free tiers for a single-user app; document the limits |

## 14. Open Questions

1. What specific simple authentication approach should be used? (e.g., single password field, NextAuth with credentials provider, HTTP Basic Auth)
2. Should there be a way to archive or hide completed tasks instead of deleting them?
3. Should tasks have a "created at" timestamp visible to the user?
4. What is the desired behavior for tasks without a due date — should they appear at the top or bottom when sorting by date?
5. Should the app remember the last used filter/sort state across sessions?
6. Is there a preferred color scheme or visual identity beyond the default setup?

## 15. Handoff Notes for Frontend Architect

- This is a **single-user** app. All UI decisions should optimize for one person’s daily workflow, not multi-user collaboration.
- The **Kanban board is the centerpiece** of the experience. Prioritize making it fast, visually clear, and pleasant to interact with on both mobile and desktop.
- **Mobile experience is critical** — the user will check and update tasks from their phone. Touch targets must be large enough, and the layout must adapt gracefully to narrow screens.
- **Overdue tasks need strong visual treatment** — this is one of the main value propositions. Do not make overdue states subtle.
- The app should feel **instant** — search and filtering should not require page reloads. Consider optimistic UI updates when moving tasks between columns.
- **No localStorage fallbacks** — the source of truth is always the cloud database. Handle loading and error states gracefully when the network is slow or unavailable.
- Keep the **UI minimal and focused**. Avoid dashboards, sidebars, or complex navigation. The Kanban board should be the default and primary view.
- The user explicitly wants this to be a **portfolio-quality project** — prioritize clean code, good UX patterns, and responsive design.
- Authentication should be **frictionless but present** — the user does not want a complex login flow, but the data must not be publicly accessible.
