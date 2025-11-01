# Surge-25 (UniConnect)

A **campus job marketplace** connecting students for academic projects, startups, internships, and campus opportunities. Built with Next.js 15 and featuring real-time messaging, job postings, and AI-powered assistance.

🚀 **Live Demo:** [https://surge-25.vercel.app](https://surge-25.vercel.app)

## Tech Stack

- **Framework:** Next.js 15.5.5 (React 19) with Turbopack
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better Auth (with OAuth support)
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui (New York variant)
- **API Layer:** Hono with typed client
- **State Management:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Real-time:** Pusher (messaging & notifications)
- **File Upload:** UploadThing
- **Email:** Resend + Nodemailer
- **AI Integration:** Google Gemini API
- **3D Graphics:** Three.js + React Three Fiber
- **Icons:** Lucide React + Tabler Icons

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (Package manager)
- **PostgreSQL** (Database server)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd surge-25
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Then update the following required environment variables:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/surge25?schema=public"

# Auth (Required)
BETTER_AUTH_SECRET="your-secret-key-here"  # Generate a secure random string
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Service (Required for verification)
RESEND_API_KEY="your-resend-api-key"
RESEND_EMAIL="noreply@yourdomain.com"

# OAuth (Optional - for social login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI Features (Optional)
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"

# Real-time Features (Required for messaging)
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"

# File Uploads (Required for profile images/attachments)
UPLOADTHING_TOKEN="your-uploadthing-token"
```

> **Note:** See `.env.example` for all available configuration options. Required variables must be set for the application to function properly.

### 3. Install Dependencies

Install all required packages using pnpm:

```bash
pnpm install
```

### 4. Set Up the Database

#### Option A: If you have an existing database with tables

Generate the Prisma client:

```bash
pnpm dlx prisma generate
```

#### Option B: If your database is empty or you need to create tables

Push the Prisma schema to your database:

```bash
pnpm dlx prisma db push
```

This will:
- Create all necessary tables in your database
- Generate the Prisma client in `src/generated/prisma`

### 5. Run the Development Server

Start the development server with:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Production Deployment

### Build the Application

To create an optimized production build with Turbopack:

```bash
pnpm run build
```

### Start the Production Server

After building, start the production server:

```bash
pnpm run start
```

### Seed the Database

To populate the database with sample data:

```bash
pnpm run seed
```

> **Note:** This requires Bun runtime to be installed.

## Available Scripts

- **`pnpm run dev`** - Start the development server with Turbopack
- **`pnpm run build`** - Build the application for production with Turbopack
- **`pnpm run start`** - Start the production server
- **`pnpm run lint`** - Run ESLint to check for code issues
- **`pnpm run seed`** - Seed the database with sample data (requires Bun)
- **`pnpm dlx prisma generate`** - Generate Prisma client to `src/generated/prisma`
- **`pnpm dlx prisma db push`** - Push schema changes to the database
- **`pnpm dlx prisma studio`** - Open Prisma Studio to view/edit data

## Project Structure

```
surge-25/
├── prisma/
│   └── schema.prisma                 # Database schema
├── seed/
│   ├── seed.ts                       # Database seeding script
│   └── seed-messages.ts              # Message seeding utilities
├── src/
│   ├── app/                          # Next.js app directory (App Router)
│   │   ├── (auth)/                  # Auth route group (sign in/up)
│   │   ├── (root)/                  # Public pages (landing)
│   │   ├── (protected)/             # Protected routes
│   │   ├── (dashboard)/             # Dashboard features
│   │   │   ├── finder/             # Job finder dashboard
│   │   │   └── seeker/             # Job seeker dashboard
│   │   ├── (dms)/                   # Messaging features
│   │   ├── (profile)/               # User profile pages
│   │   ├── api/
│   │   │   ├── [[...route]]/       # Hono API routes (catch-all)
│   │   │   ├── auth/               # Better Auth endpoints
│   │   │   └── uploadthing/        # File upload endpoints
│   │   └── sample/                  # Sample feature module
│   ├── components/
│   │   ├── chat/                    # Chat & messaging components
│   │   ├── layout/                  # Layout components (header, etc.)
│   │   ├── notifications/           # Notification system
│   │   ├── providers/               # React context providers
│   │   ├── sections/                # Landing page sections
│   │   ├── three/                   # Three.js 3D components
│   │   └── ui/                      # shadcn/ui components
│   ├── constants/
│   │   └── query-keys.ts            # TanStack Query keys
│   ├── generated/
│   │   └── prisma/                  # Generated Prisma client
│   ├── hooks/                        # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts                  # Better Auth configuration
│   │   ├── auth-client.ts           # Auth client hooks
│   │   ├── current-user.ts          # Server-side user helper
│   │   ├── db.ts                    # Prisma client singleton
│   │   ├── hono.ts                  # Typed Hono client
│   │   ├── pusher.ts                # Pusher configuration
│   │   ├── notifications.ts         # Notification utilities
│   │   ├── email.ts                 # Email service
│   │   └── uploadthing.ts           # UploadThing config
│   ├── types/                        # TypeScript type definitions
│   ├── middleware.ts                 # Auth & route middleware
│   └── routes.ts                     # Route configuration
├── .env                              # Environment variables (create this)
├── .env.example                      # Environment template
└── package.json                      # Dependencies and scripts
```

## Key Features

- 🔐 **Authentication** - Email/password + OAuth (Google, GitHub)
- 💼 **Job Marketplace** - Post and apply for campus opportunities
- 💬 **Real-time Messaging** - Chat with job posters/applicants
- 🔔 **Notifications** - Real-time updates via Pusher
- 🤖 **AI Assistant** - Google Gemini integration
- 📁 **File Uploads** - Profile images and attachments via UploadThing
- 🎨 **Modern UI** - Responsive design with Tailwind CSS 4
- 🌐 **3D Visualizations** - Three.js globe and effects

## Database Schema

The application uses the following main models:

- **User** - User accounts with extended profile fields (role, campus, skills, etc.)
- **Session** - User sessions for authentication
- **Account** - OAuth and credential accounts
- **Verification** - Email/phone verification tokens
- **JobPost** - Job postings with type (project, startup, internship, campus)
- **Application** - Job applications with status tracking
- **SavedJob** - Bookmarked jobs
- **Conversation** - Chat conversations between users
- **Message** - Chat messages with read status
- **Notification** - User notifications with read/delivered status

## Architecture Highlights

### API Layer
- All API routes defined in `src/app/api/[[...route]]/route.ts` using **Hono**
- Controllers organized by feature in `controllers/` directory
- Request validation with **Zod** via `@hono/zod-validator`
- Type-safe client generated from Hono routes

### Prisma Configuration
- ⚠️ **Important**: Prisma client generated to `src/generated/prisma` (not default `node_modules`)
- Always import: `import { PrismaClient } from "@/generated/prisma"`
- Database singleton available at `@/lib/db`

### State Management
- **TanStack Query** for all server state
- Query keys centralized in `src/constants/query-keys.ts`
- API hooks organized in feature `_api/` folders
- Type inference from Hono routes using `InferRequestType` and `InferResponseType`

### Route Protection
- Middleware handles authentication via `better-auth`
- Route patterns in `src/routes.ts`:
  - `authRoutes` - Authentication pages (public)
  - `publicRoutes` - Publicly accessible pages
  - All other routes require authentication

## Configuration Details

### OAuth Setup

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`

### Pusher Setup
1. Create account at [Pusher.com](https://pusher.com/)
2. Create a Channels app
3. Copy credentials to `.env` file

### UploadThing Setup
1. Sign up at [UploadThing](https://uploadthing.com/)
2. Create an app
3. Copy API token to `.env`

### Resend Email Setup
1. Sign up at [Resend](https://resend.com/)
2. Verify your sending domain
3. Generate API key and add to `.env`

## Troubleshooting

### Prisma Client Not Found

If you encounter errors about Prisma client not being found:

```bash
pnpm dlx prisma generate
```

The client should be generated to `src/generated/prisma` automatically on `postinstall`.

### Database Connection Issues

- Verify your `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check that the database exists
- For Neon/cloud databases, ensure SSL mode is configured

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
pnpm dev -- -p 3001
```

Don't forget to update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` in `.env`.

### Real-time Features Not Working

- Verify Pusher credentials are correct in `.env`
- Check browser console for Pusher connection errors
- Ensure `NEXT_PUBLIC_PUSHER_KEY` and `NEXT_PUBLIC_PUSHER_CLUSTER` are set

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
