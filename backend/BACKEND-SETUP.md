# 🚀 Quick Start - Backend Setup

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- express (web server)
- sqlite3 (database)
- bcryptjs (password hashing)
- jsonwebtoken (auth tokens)
- cors (cross-origin requests)

---

## Step 2: Start Backend Server

```bash
npm start
```

You'll see:
```
╔════════════════════════════════════════╗
║   🛡️  Safe Haven Backend Server       ║
║                                        ║
║   Server running on port 3001          ║
║   http://localhost:3001                ║
║                                        ║
║   SQLite database ready ✅             ║
╚════════════════════════════════════════╝
```

**Backend is now running!** ✅

---

## Step 3: Start Frontend (in NEW terminal)

```bash
cd ..
npm run dev
```

Frontend runs on: `http://localhost:3000`
Backend runs on: `http://localhost:3001`

---

## ✅ You Now Have:

- **Backend API** on port 3001
- **Frontend app** on port 3000
- **SQLite database** with 5 demo posts
- **Auth system** ready to use

---

## 📝 Example: Use the API

### Register a user:
```javascript
import { auth } from '../lib/api';

const result = await auth.register(
  'test@example.com',
  'password123',
  'John Doe',
  'Downtown'
);
```

### Get all posts:
```javascript
import { posts } from '../lib/api';

const allPosts = await posts.getAll();
const safetyPosts = await posts.getAll('safety');
```

### Create a post:
```javascript
import { posts } from '../lib/api';

const newPost = await posts.create({
  userId: 1,
  authorName: 'John Doe',
  category: 'safety',
  title: 'Street Light Out',
  description: 'The street light on Main St is broken',
  neighborhood: 'Downtown',
  latitude: 40.7128,
  longitude: -74.0060
});
```

---

## 🔍 Test the API

Visit in your browser:
- http://localhost:3001/api/posts (see all posts)

Or use curl:
```bash
curl http://localhost:3001/api/posts
```

---

## 🗄️ Database File

Location: `backend/safehaven.db`

View with:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (GUI)
- Or command line: `sqlite3 safehaven.db`

---

## 🔄 Reset Everything

```bash
cd backend
rm safehaven.db
npm start
```

Fresh database with demo data!

---

## That's It! 🎉

Backend is running and ready to use.
Frontend can now make API calls.
No Firebase configuration needed!
