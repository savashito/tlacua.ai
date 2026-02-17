# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Node.js (if not already installed)
Download from [nodejs.org](https://nodejs.org) - use the LTS version

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
```bash
cp .env.example .env
```

### Step 4: (Optional) Add Real Meta Credentials
Edit `.env` and add:
- `META_APP_ID` - from your Meta app dashboard
- `META_APP_SECRET` - from your Meta app dashboard

### Step 5: Start the Server
```bash
npm start
```

You should see:
```
🚀 WhatsApp Permission Demo Server Running
📍 URL: http://localhost:3000
```

### Step 6: Open in Browser
Go to: **http://localhost:3000**

## That's it! 

You now have a working demo of the WhatsApp permission request flow.

---

## What to Do Next

### For Recording a Demo
1. Open http://localhost:3000 in your browser
2. Click "Connect WhatsApp Account"
3. Follow the flow and take screenshots/video
4. Use the README's "Creating a Screen Recording" section for detailed instructions

### To Integrate With Real Meta Credentials
1. Create a Meta Developer account at developers.facebook.com
2. Create a new app and add WhatsApp product
3. Get your App ID and App Secret
4. Update your `.env` file with these credentials
5. Update your app's OAuth redirect URI in Meta settings to `http://localhost:3000/callback`
6. The OAuth flow will then work with real Meta authentication

### Troubleshooting
- **Port already in use?** Change PORT in `.env` to 3001, 3002, etc.
- **Missing dependencies?** Run `npm install` again
- **Module not found?** Delete `node_modules` folder and run `npm install`

---

## File Structure
```
├── server.js          ← Express server
├── package.json       ← Dependencies
├── .env               ← Your config (create from .env.example)
├── .env.example       ← Template
├── README.md          ← Full documentation
├── public/
│   ├── index.html     ← Main landing page
│   └── success.html   ← Success page after login
```

---

## Commands Cheat Sheet

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm start` | Run server (production) |
| `npm run dev` | Run server with auto-reload (development) |
| `ctrl+c` | Stop the server |

---

**Need help?** Check the full README.md for detailed documentation and recording instructions.
