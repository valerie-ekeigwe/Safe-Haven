# Safe Haven - Quick Start Guide

Get your Safe Haven community platform up and running in 15 minutes!

## Step 1: Install Node.js

If you don't have Node.js installed:
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation by opening a terminal and typing: `node --version`

## Step 2: Set Up Firebase

### Create a Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Give it a name (e.g., "safe-haven-yourneighborhood")
4. Click through the setup wizard
5. Disable Google Analytics (optional but simplifies setup)

### Enable Authentication
1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Enable "Google" sign-in method (optional but recommended)
   - Add your email as a project support email

### Create Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in "test mode" (we'll secure it later)
4. Choose a location close to you
5. Click "Enable"

### Enable Storage
1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Start in "test mode"
4. Click "Done"

### Get Your Firebase Config
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app (name it anything)
6. Copy the configuration values (you'll need these!)

## Step 3: Set Up the Project

### Extract the Project Files
1. Extract the safe-haven folder to your desired location
2. Open a terminal/command prompt
3. Navigate to the project folder:
   ```bash
   cd path/to/safe-haven
   ```

### Install Dependencies
Run this command (it might take a few minutes):
```bash
npm install
```

### Configure Environment Variables
1. In the safe-haven folder, create a new file called `.env.local`
2. Copy this template and fill in your Firebase values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Where to find these values:**
- All values are in the Firebase config you copied in Step 2
- apiKey → NEXT_PUBLIC_FIREBASE_API_KEY
- authDomain → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- projectId → NEXT_PUBLIC_FIREBASE_PROJECT_ID
- storageBucket → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- messagingSenderId → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- appId → NEXT_PUBLIC_FIREBASE_APP_ID

## Step 4: Run the App

Start the development server:
```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open your browser and go to: **http://localhost:3000**

🎉 Your Safe Haven app is now running!

## Step 5: Create Your First Account

1. Click "Sign up" on the homepage
2. Fill in your information
3. Create an account
4. You're in! Start creating posts

## Step 6: Secure Your Firebase (Important!)

### Update Firestore Rules
1. Go back to Firebase Console
2. Click "Firestore Database"
3. Click "Rules" tab
4. Replace the contents with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
      
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth.uid == resource.data.userId;
      }
    }
    
    match /neighborhoods/{neighborhoodId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

5. Click "Publish"

### Update Storage Rules
1. Click "Storage" in the left sidebar
2. Click "Rules" tab
3. Replace the contents with:

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

4. Click "Publish"

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Double-check your .env.local file
- Make sure all values are correct
- Restart the dev server: Stop it (Ctrl+C) and run `npm run dev` again

### "Permission denied" errors
- Make sure you've updated the Firestore and Storage rules
- Try logging out and back in

### Images not uploading
- Check that Storage rules are published
- Verify images are under 5MB
- Make sure you're logged in

### Map not showing
- The map uses your browser's location permission
- Click "Allow" when prompted for location access
- If using Chrome, make sure location services are enabled

### Port 3000 already in use
- Something else is using port 3000
- Either close that application or run on a different port:
  ```bash
  npm run dev -- -p 3001
  ```
- Then visit http://localhost:3001

## Next Steps

### Customize for Your Neighborhood
1. Update the landing page text in `pages/index.js`
2. Add your neighborhood name in the signup flow
3. Customize colors in `tailwind.config.js`

### Invite Neighbors
1. Share the URL when you deploy
2. Create an invitation post on your neighborhood's social media
3. Put up flyers with the website address

### Deploy to Production
When you're ready to go live, see the deployment guide in README.md

## Need Help?

- Check the main README.md for detailed documentation
- Review the Firebase documentation: https://firebase.google.com/docs
- Check Next.js docs: https://nextjs.org/docs

## Important Security Notes

1. **Never share your .env.local file** - It contains sensitive credentials
2. **Use Firebase's free tier** - It's generous enough for most neighborhoods
3. **Monitor your Firebase usage** - Check the console regularly
4. **Set up billing alerts** - Prevent unexpected charges

---

**Congratulations!** You now have a fully functional community safety platform. 

Start by creating some sample posts, exploring the map, and inviting your first neighbors to join! 🏘️✨
