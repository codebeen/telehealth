# Telehealth Platform

A full-stack telehealth web application MVP enabling secure online doctor consultations, appointment booking, AI-based doctor recommendations, and comprehensive medical record management.

## Overview

This telehealth platform is designed to connect patients with healthcare professionals in a seamless, secure, and user-friendly environment. The application supports both patient and doctor workflows, featuring real-time notifications, virtual consultation sessions, and intelligent doctor recommendations based on medical needs.

## Features

### Patient Module

- **Patient Account Management**
  - Secure registration and login with email/password
  - Comprehensive profile setup (name, birthday, weight, height, profile picture, contact details, medical history)
  - Profile updates and management

- **Doctor Discovery**
  - Browse and view available doctors
  - Filter doctors by specialization
  - Check doctor availability and schedules
  - View doctor profiles and credentials

- **AI-Powered Recommendations**
  - Describe symptoms or healthcare concerns
  - Receive AI-recommended doctors based on medical needs and specialization
  - Smart doctor matching

- **Appointment Booking**
  - Book online consultations with available doctors
  - Reschedule or cancel appointments
  - Real-time push notifications for bookings and updates
  - Appointment reminders

- **Virtual Consultation Sessions**
  - Join scheduled consultations online
  - Secure video/audio communication with doctors
  - Chat and document sharing during sessions

- **Medical Records**
  - View appointment history
  - Access medical records and prescriptions from doctors
  - Download and store health documents
  - Track consultation summaries

### Doctor Module

- **Doctor Account Management**
  - Secure registration and login
  - Professional profile with bio and specialization
  - Credential verification

- **Medical Records Access**
  - View patient consultation history
  - Access medical records and previously issued prescriptions
  - Review patient medical history

- **Consultation Schedule Management**
  - Manage availability and consultation schedules
  - Block unavailable time slots
  - Real-time push notifications for bookings and updates
  - Schedule overview and management dashboard

- **Consultation Notes & Prescriptions**
  - Add detailed consultation notes
  - Issue prescriptions
  - Document medical findings and recommendations
  - Generate consultation summaries

- **Virtual Consultation Sessions**
  - Join scheduled consultations with patients
  - Conduct secure video/audio consultations
  - Share documents and notes with patients

## Technology Stack

### Frontend
- **Next.js 16** - React framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Socket.io** - Real-time notifications

### Backend
- **NestJS 11** - TypeScript framework
- **Prisma** - ORM for database management
- **PostgreSQL 15** - Relational database
- **JWT** - Authentication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pnpm** - Fast, efficient package manager

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- pnpm

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telehealth
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start the entire stack**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Local Development Setup

#### Backend Setup
```bash
cd api

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Run database migrations
pnpm prisma migrate dev

# Start development server (with hot reload)
pnpm run start:dev
```

Backend runs on `http://localhost:3001`

#### Frontend Setup
```bash
cd web

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development server
pnpm run dev
```

Frontend runs on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/telehealth
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
# Add other required variables
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# Add other required variables
```

## Project Structure

```
telehealth/
├── api/                        # NestJS backend
│   ├── src/
│   │   ├── common/            # Shared utilities, decorators, guards
│   │   ├── config/            # Configuration files
│   │   ├── database/          # Database setup (Prisma)
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── users/         # User management
│   │   │   ├── doctors/       # Doctor features
│   │   │   ├── patients/      # Patient features
│   │   │   ├── appointments/  # Appointment management
│   │   │   ├── consultation/  # Consultation sessions
│   │   │   ├── medical-records/ # Medical records
│   │   │   └── ai/            # AI recommendations
│   │   └── main.ts
│   ├── test/                  # E2E tests
│   ├── Dockerfile.dev         # Development container
│   └── package.json
│
├── web/                       # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── (auth)/       # Auth pages (login, register)
│   │   │   ├── doctor/       # Doctor dashboard
│   │   │   └── patient/      # Patient dashboard
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configs
│   │   └── modules/          # Feature modules
│   ├── public/               # Static assets
│   ├── Dockerfile.dev        # Development container
│   └── package.json
│
├── docker-compose.yml        # Multi-container setup
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

### Patients
- `GET /patients` - List all patients
- `GET /patients/:id` - Get patient details
- `PUT /patients/:id` - Update patient profile
- `GET /patients/:id/medical-records` - Get patient medical records

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Get doctor details
- `PUT /doctors/:id` - Update doctor profile
- `GET /doctors/:id/appointments` - Get doctor appointments

### Appointments
- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Consultation
- `GET /consultation/sessions` - List consultation sessions
- `POST /consultation/sessions` - Create session
- `POST /consultation/sessions/:id/join` - Join session

### Medical Records
- `GET /medical-records` - List records
- `POST /medical-records` - Create record
- `GET /medical-records/:id` - Get record details

### AI Recommendations
- `POST /ai/recommend-doctors` - Get doctor recommendations based on symptoms

## Testing

### Run Backend Tests
```bash
cd api
pnpm test              # Unit tests
pnpm test:watch       # Watch mode
pnpm test:cov         # Coverage report
pnpm test:e2e         # E2E tests
```

### Run Frontend Tests
```bash
cd web
pnpm test             # Run tests
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Run formatter before commit: `pnpm run format`

### Commit Convention
Use conventional commits for clear commit history:
```
feat: Add doctor discovery feature
fix: Fix appointment booking bug
docs: Update README
style: Format code
test: Add tests for auth module
```

### Database Migrations
```bash
cd api

# Create new migration
pnpm prisma migrate dev --name migration_name

# View database
pnpm prisma studio
```

## Docker Commands

### Build and Start
```bash
docker compose up --build
```

### Start (without rebuild)
```bash
docker compose up
```

### Stop Services
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f [service-name]  # e.g., api, web, postgres
```

### Rebuild Specific Service
```bash
docker compose build [service-name]
```

## Security Considerations

- JWT tokens for API authentication
- Passwords hashed with bcrypt
- Environment variables for sensitive data
- CORS configuration for frontend access
- Input validation and sanitization
- SQL injection prevention via Prisma ORM

## Performance & Optimization

- Hot module reload (HMR) enabled for frontend
- API response caching where applicable
- Database query optimization with Prisma
- Real-time updates via WebSocket (Socket.io)
- Lazy loading and code splitting in frontend

## Troubleshooting

### Docker Issues
- **Port already in use**: Change ports in `docker-compose.yml`
- **Database connection error**: Ensure postgres service is running
- **Hot reload not working**: Check volume mounts in docker-compose.yml

### Common Commands
```bash
# Check running containers
docker compose ps

# Restart a service
docker compose restart [service-name]

# Remove everything and start fresh
docker compose down -v
docker compose up --build
```
