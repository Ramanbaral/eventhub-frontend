# EventHub – Frontend

A event management application that lets users browse, create, filter, and manage events. Built with **React**, **TypeScript**, **TanStack Router**, and **Tailwind CSS v4**, running on **Vite**.

**Live Website:** [https://eventhub.ramanbaral.me/](https://eventhub.ramanbaral.me/)

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)

---

## Setup Instructions

### Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | ≥ 18.x  |
| pnpm    | ≥ 8.x   |

> **Note:** This project uses **pnpm** as the package manager (a `pnpm-lock.yaml` is present). If you prefer npm or yarn, delete the lockfile first, but pnpm is recommended for consistency.

### 1. Clone the Repository

```bash
git clone https://github.com/Ramanbaral/eventhub-frontend.git
cd eventhub_frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root (or copy the existing one) with the following variable:

```env
VITE_BACKEND_URL = "http://localhost:3000/api/v1"
```

Adjust the URL to point to wherever the EventHub backend API is running.

### 4. Start the Development Server

```bash
pnpm dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### 5. Build for Production (Optional)

```bash
pnpm build
```

The output will be in the `dist/` directory, ready to be served by any static file server.

### 6. Preview the Production Build

```bash
pnpm preview
```

### Available Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the Vite dev server with HMR       |
| `pnpm build`        | Type-check and build for production      |
| `pnpm preview`      | Preview the production build locally     |
| `pnpm lint`         | Run ESLint across the project            |
| `pnpm format`       | Format all files with Prettier           |
| `pnpm format:check` | Check formatting without writing changes |

---

## Project Structure

```
eventhub_frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/
│   │   ├── auth/            # LoginForm, RegisterForm
│   │   ├── events/          # EventCard, EventFilter, EventGrid,
│   │   │                    # SearchBar, EditEventModal, DeleteEventModal,
│   │   │                    # EmptyState, EventError
│   │   ├── layout/          # Navbar
│   │   └── ui/              # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── context/             # AuthContext (React Context for auth state)
│   ├── lib/                 # Utility functions (buildFilterParams, cn helper)
│   ├── routes/              # TanStack Router file-based routes
│   │   ├── __root.tsx       # Root layout (Navbar + Outlet)
│   │   ├── index.tsx        # Home – all events listing
│   │   ├── upcoming.tsx     # Upcoming events listing
│   │   ├── past.tsx         # Past events listing
│   │   ├── my-events.tsx    # Authenticated user's events
│   │   ├── _auth/
│   │   │   ├── login.tsx    # Login page
│   │   │   └── register.tsx # Registration page
│   │   └── event/
│   │       ├── create.tsx   # Event creation form
│   │       └── $eventId.tsx # Event detail page (dynamic route)
│   ├── types/               # TypeScript type definitions
│   ├── main.tsx             # App entry point
│   ├── routeTree.gen.ts     # Auto-generated route tree (do not edit)
│   └── index.css            # Global styles + Tailwind directives
├── .env                     # Environment variables
├── components.json          # shadcn/ui configuration
├── vite.config.ts           # Vite + TanStack Router + Tailwind plugin config
├── tsconfig.app.json        # TypeScript config (app source)
├── tsconfig.node.json       # TypeScript config (Node tooling)
├── eslint.config.js         # ESLint configuration
├── .prettierrc              # Prettier configuration
└── package.json             # Dependencies and scripts
```
