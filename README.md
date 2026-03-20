# Chamber of Commerce Platform

A full-stack web platform for managing a local Chamber of Commerce organization, featuring a public-facing website, an admin management panel, and a RESTful API backend.

## Architecture

```
├── frontend/    # Public website (React + Vite)
├── admin/       # Admin management panel (React + Vite)
├── backend/     # REST API server (Express + MySQL)
└── database/    # SQL schema and seed data
```

## Tech Stack

- **Frontend & Admin**: React 19, React Router, Vite, Axios
- **Backend**: Node.js, Express 5, MySQL2, JWT Authentication, Multer (file uploads)
- **Database**: MySQL 8 with utf8mb4 charset

## Features

### Public Website
- Hero banner carousel with customizable slides
- Member directory organized by organizational roles
- Member profile pages with company details, introductions, and videos
- Responsive design for mobile and desktop

### Admin Panel
- Secure login with role-based access (superadmin / editor)
- Banner management (create, edit, reorder, toggle visibility)
- Member and role management
- Company profile editing with logo and video uploads
- Organization settings configuration

### Backend API
- JWT-based authentication
- RESTful endpoints for all resources
- File upload handling for images and media
- CORS support for multi-origin frontend access

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8.0

### Database Setup

```bash
mysql -u root -p < database/schema.sql
```

### Backend

```bash
cd backend
cp .env.example .env   # Configure your database credentials
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Admin Panel

```bash
cd admin
npm install
npm run dev
```

## Environment Variables

The backend requires a `.env` file with the following variables:

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASS` | MySQL password |
| `DB_NAME` | Database name |
| `PORT` | Server port |
| `JWT_SECRET` | Secret key for JWT tokens |
| `FRONTEND_URL` | Frontend origin for CORS |
| `ADMIN_URL` | Admin panel origin for CORS |
| `SERVER_HOST` | Server bind address |

## License

MIT
