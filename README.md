# Safe Haven - Community Safety Platform

A modern, human-centered neighborhood watch and community safety application. Built with Next.js, Firebase, and React, featuring real-time updates, interactive maps, and accessibility-first design.

##  Features

### Core Features
- **Community Feed** - Share and view real-time updates from your neighborhood
- **Interactive Map** - Visual representation of incidents and events with filtering
- **Emergency Alerts** - Quick access to emergency contacts and active alerts
- **Post Creation** - Easy-to-use interface for reporting incidents, lost pets, events
- **Real-time Updates** - Instant notifications when something happens nearby
- **Accessibility Focus** - Clean, readable design with proper contrast and spacing

### Post Categories
- Safety & Security Issues
- Lost & Found Pets
- Community Events
- Questions & Discussions
- Accessibility Reports
- General Updates

### User Features
- Email/Password and Google authentication
- Verified user badges
- Neighborhood-based filtering
- Location-based distance calculations
- Image uploads (up to 4 per post)
- Comment and engagement system
- User profiles and settings

##  Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Firebase account (free tier works great)
- Google Maps API key (optional, for enhanced mapping)

### Installation

1. **Clone or download the project**
```bash
cd safe-haven
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database (start in test mode)
   - Enable Storage
   - Copy your Firebase config

4. **Create environment file**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
safe-haven/
├── components/          # Reusable React components
│   ├── Layout.js       # Main layout wrapper with navigation
│   ├── PostCard.js     # Individual post display
│   ├── CreatePost.js   # Post creation modal
│   └── MapView.js      # Interactive map component
├── contexts/           # React Context providers
│   └── AuthContext.js  # Authentication state management
├── lib/                # Utility functions and configs
│   ├── firebase.js     # Firebase initialization
│   ├── db.js          # Database operations
│   └── utils.js       # Helper functions
├── pages/              # Next.js pages (routes)
│   ├── index.js       # Landing page
│   ├── signup.js      # User registration
│   ├── login.js       # User login
│   ├── feed.js        # Main community feed
│   ├── map.js         # Interactive map view
│   └── alerts.js      # Emergency alerts
├── styles/             # Global styles
│   └── globals.css    # Tailwind CSS and custom styles
└── public/             # Static assets

```

## Design Philosophy

Safe Haven follows a MetaLab-inspired design approach:
- **Clean & Purposeful** - Every element serves a function
- **Human-Centered** - Warm, approachable, not corporate
- **Accessible** - High contrast, readable fonts, clear hierarchy
- **Subtle** - Elegant shadows and borders, not overdone
- **Responsive** - Works beautifully on all devices

### Color Palette
- Stone (neutrals): Primary UI elements
- Amber (accent): Warmth and approachability
- Category colors: Red (safety), Blue (pets), Green (events), etc.

##  Configuration

### Firebase Security Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth.uid == resource.data.userId;
      }
    }
    
    // Neighborhoods collection
    match /neighborhoods/{neighborhoodId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Alerts collection
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 📱 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add your environment variables
5. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Keep credentials secure
2. **Use Firebase Security Rules** - Protect your database
3. **Validate user input** - Both client and server side
4. **Implement rate limiting** - Prevent abuse
5. **Monitor Firebase usage** - Watch for unusual activity

## 🤝 Contributing

This is a community-focused project. Contributions are welcome!

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use functional components with hooks
- Follow existing naming conventions
- Keep components small and focused
- Comment complex logic
- Use TypeScript types (if converting to TS)

## 📄 License

MIT License - feel free to use this project for your community!

## 🆘 Support

### Common Issues

**Firebase connection errors:**
- Check your environment variables
- Verify Firebase project settings
- Ensure billing is enabled (free tier is fine)

**Map not loading:**
- Check Leaflet CSS import
- Verify location permissions in browser
- Check browser console for errors

**Images not uploading:**
- Check Firebase Storage rules
- Verify image size < 5MB
- Check file format (JPEG, PNG, WebP)

### Getting Help
- Check the [Issues](https://github.com/yourusername/safe-haven/issues) page
- Review Firebase documentation
- Check Next.js documentation

## 🎯 Roadmap

### Planned Features
- [ ] Push notifications for mobile
- [ ] Direct messaging between neighbors
- [ ] Event RSVP system
- [ ] Neighborhood verification system
- [ ] Admin dashboard for moderators
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA) support
- [ ] Native mobile apps

## 👏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

Inspired by MetaLab's design philosophy and the need for better community connection.

---

**Made with ❤️ for safer neighborhoods**
