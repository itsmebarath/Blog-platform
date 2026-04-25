# Premium Blog Platform 🖋️

A complete, production-ready full-stack blog platform built with modern web technologies. Features a sleek design, robust authentication, and a full-featured commenting system.

## ✨ Features

- **Full Authentication**: Secure registration and login with JWT and bcrypt password hashing.
- **Story Creation**: Rich blog post creation with title, content, tags, and cover images.
- **Engagement**: Interactive comment section with real-time optimistic updates.
- **Discovery**: Advanced search and tag-based filtering with server-side pagination.
- **Premium Design**: Modern, responsive UI using Playfair Display, DM Sans, and a curated "Ink & Cream" color palette.
- **Responsive**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (ODM)
- JSON Web Tokens (JWT)
- bcryptjs (Hashing)
- express-validator

**Frontend:**
- React 18 (Vite)
- Tailwind CSS (Styling)
- React Router v6
- Axios (API Client)
- react-hot-toast (Notifications)
- date-fns (Formatting)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB installed and running locally (or a MongoDB Atlas URI)
- npm or yarn

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env
```
*Edit `.env` and add your `MONGO_URI` and `JWT_SECRET`.*

```bash
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/posts` | Get all posts (paginated) | No |
| GET | `/api/posts/:id` | Get single post | No |
| POST | `/api/posts` | Create new post | Yes |
| PUT | `/api/posts/:id` | Update post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |
| POST | `/api/comments` | Post a comment | Yes |
| GET | `/api/comments/:postId` | Get comments for post | No |
| DELETE | `/api/comments/:id` | Delete a comment | Yes |

## 📁 Project Structure

```text
blog-platform/
├── server/             # Express API
│   ├── models/         # Mongoose Schemas
│   ├── controllers/    # Business Logic
│   ├── routes/         # Express Routes
│   └── middleware/     # Auth & Validation
└── client/             # React Application
    ├── src/
    │   ├── api/        # Axios Configuration
    │   ├── components/ # Reusable UI Elements
    │   ├── context/    # Global Auth State
    │   ├── hooks/      # Custom Hooks
    │   └── pages/      # Route Components
```

## 🔧 Troubleshooting

- **MongoDB Connection**: Ensure your MongoDB service is running. On Windows, check Services or run `mongod`.
- **CORS Errors**: Verify the `CLIENT_URL` in `server/.env` matches your Vite dev server URL.
- **Port Conflicts**: If port 5000 is taken, change it in `server/.env` and update the proxy in `client/vite.config.js`.

---
Built with ❤️ for creators.
