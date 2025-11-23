const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./safehaven.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        neighborhood TEXT,
        address TEXT,
        phone TEXT,
        photo_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Posts table
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        neighborhood TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        views INTEGER DEFAULT 0,
        helpful INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Comments table
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Images table
    db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id)
      )
    `);

    console.log('✅ Database tables initialized');
    
    // Insert demo data
    insertDemoData();
  });
}

// Insert demo data
function insertDemoData() {
  db.get("SELECT COUNT(*) as count FROM posts", (err, row) => {
    if (row.count === 0) {
      const demoPosts = [
        {
          user_id: 1,
          author_name: 'Sarah Johnson',
          category: 'safety',
          title: 'Suspicious Activity on Oak Street',
          description: 'Saw someone trying car door handles around 2 AM last night. Already reported to police. Everyone please lock your cars!',
          neighborhood: 'Downtown',
          latitude: 40.7128,
          longitude: -74.0060
        },
        {
          user_id: 2,
          author_name: 'Mike Chen',
          category: 'lost-pet',
          title: 'Lost Cat - Orange Tabby',
          description: 'Our cat Whiskers went missing yesterday evening. Orange tabby with white paws. Very friendly. Please call if you see him!',
          neighborhood: 'Downtown',
          latitude: 40.7138,
          longitude: -74.0070
        },
        {
          user_id: 3,
          author_name: 'Lisa Martinez',
          category: 'event',
          title: 'Community BBQ This Saturday',
          description: 'Join us for our annual neighborhood BBQ at the park! Starts at noon. Bring your favorite dish to share.',
          neighborhood: 'Downtown',
          latitude: 40.7118,
          longitude: -74.0050
        },
        {
          user_id: 4,
          author_name: 'John Smith',
          category: 'question',
          title: 'Recommendations for Local Plumber?',
          description: 'Need a reliable plumber for a leak repair. Any recommendations?',
          neighborhood: 'Downtown',
          latitude: 40.7108,
          longitude: -74.0080
        },
        {
          user_id: 5,
          author_name: 'Emma Wilson',
          category: 'accessibility',
          title: 'Broken Wheelchair Ramp',
          description: 'The wheelchair ramp at Main Street library has a large crack. Needs repair urgently.',
          neighborhood: 'Downtown',
          latitude: 40.7148,
          longitude: -74.0040
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO posts (user_id, author_name, category, title, description, neighborhood, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      demoPosts.forEach(post => {
        stmt.run(
          post.user_id,
          post.author_name,
          post.category,
          post.title,
          post.description,
          post.neighborhood,
          post.latitude,
          post.longitude
        );
      });

      stmt.finalize();
      console.log('✅ Demo posts inserted');
    }
  });
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, neighborhood } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.run(
      'INSERT INTO users (email, password, name, neighborhood) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, neighborhood || 'Downtown'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
          token,
          user: {
            id: this.lastID,
            email,
            name,
            neighborhood: neighborhood || 'Downtown'
          }
        });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        neighborhood: user.neighborhood,
        address: user.address,
        phone: user.phone,
        photoURL: user.photo_url
      }
    });
  });
});

// ==================== POST ROUTES ====================

// Get all posts
app.get('/api/posts', (req, res) => {
  const { category } = req.query;

  let query = 'SELECT * FROM posts ORDER BY created_at DESC';
  let params = [];

  if (category && category !== 'all') {
    query = 'SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC';
    params = [category];
  }

  db.all(query, params, (err, posts) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(posts);
  });
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;

  // Increment views
  db.run('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);

  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  });
});

// Create post
app.post('/api/posts', (req, res) => {
  const {
    userId,
    authorName,
    category,
    title,
    description,
    neighborhood,
    latitude,
    longitude
  } = req.body;

  if (!userId || !authorName || !category || !title || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO posts (user_id, author_name, category, title, description, neighborhood, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, authorName, category, title, description, neighborhood || 'Downtown', latitude, longitude],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        id: this.lastID,
        message: 'Post created successfully'
      });
    }
  );
});

// Mark post as helpful
app.post('/api/posts/:id/helpful', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE posts SET helpful = helpful + 1 WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    db.get('SELECT helpful FROM posts WHERE id = ?', [id], (err, post) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ helpful: post.helpful });
    });
  });
});

// ==================== COMMENT ROUTES ====================

// Get comments for a post
app.get('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;

  db.all(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC',
    [postId],
    (err, comments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(comments);
    }
  );
});

// Add comment
app.post('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { userId, authorName, text } = req.body;

  if (!userId || !authorName || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO comments (post_id, user_id, author_name, text) VALUES (?, ?, ?, ?)',
    [postId, userId, authorName, text],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        id: this.lastID,
        message: 'Comment added successfully'
      });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🛡️  Safe Haven Backend Server       ║
║                                        ║
║   Server running on port ${PORT}        ║
║   http://localhost:${PORT}              ║
║                                        ║
║   SQLite database ready ✅             ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\n👋 Database connection closed');
    process.exit(0);
  });
});
