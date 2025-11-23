# Safe Haven Backend

Quick SQLite + Express backend - no Firebase needed!

## 🚀 Super Fast Setup (2 minutes)

### 1. Install dependencies:
```bash
cd backend
npm install
```

### 2. Start the server:
```bash
npm start
```

That's it! Server runs on `http://localhost:3001`

---

## ✅ What's Included:

- **SQLite Database** - No setup, just works
- **5 Demo Posts** - Auto-loaded on first run
- **Auth System** - Register/Login with JWT
- **All CRUD Operations** - Posts, Comments, Users

---

## 📡 API Endpoints:

### Auth:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Posts:
- `GET /api/posts` - Get all posts (optional `?category=safety`)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/helpful` - Mark as helpful

### Comments:
- `GET /api/posts/:postId/comments` - Get comments
- `POST /api/posts/:postId/comments` - Add comment

---

## 🗄️ Database:

SQLite file: `safehaven.db` (auto-created)

Tables:
- `users` - User accounts
- `posts` - Community posts
- `comments` - Post comments  
- `images` - Post images

---

## 🔧 Development Mode:

```bash
npm run dev
```

Auto-restarts on file changes!

---

## 💾 Reset Database:

```bash
rm safehaven.db
npm start
```

Fresh database with demo data!
