# 🛡️ MaskME

**Disposable Digital Identity Generator** – A browser extension + backend system that lets users create temporary email aliases instead of sharing their real email during online sign-ups. This helps protect privacy, reduce spam, and avoid long-term tracking.

---

## 🎯 Overview

MaskME generates disposable email aliases on demand and delivers them through a clean browser extension interface.  
Behind the scenes, a Node.js + Express backend API creates unique aliases (like `user-a83f91@maskme.io`) which can later be extended with expiry rules, OTP handling, and database storage.

The goal is to provide:
- A simple, one-click way to mask your real identity
- A privacy-first alternative to using your personal email everywhere
- A foundation for a full privacy-preserving identity system (aliases, OTP, expiry, encryption, dashboard, etc.)

---

## ✨ Features

- Generate unique disposable email aliases
- React + Vite powered browser extension popup
- Live backend API integration using REST (Fetch)
- UUID-based random alias generation
- Clean full-stack separation: `frontend/`, `backend/`, `database/` (planned)

---

## 📁 Folder Structure

```
MaskME/
├── backend/                    # Node.js + Express API server
│   ├── src/
│   │   ├── app.js             # Express app configuration & middleware
│   │   ├── routes/             # API route definitions
│   │   │   └── aliasRoutes.js  # Alias generation routes
│   │   ├── controllers/        # Request handlers
│   │   │   └── aliasController.js
│   │   ├── services/           # Business logic layer
│   │   │   └── aliasService.js # Alias generation service
│   │   ├── middleware/         # Custom middleware (auth, validation, etc.)
│   │   ├── config/             # Configuration files
│   │   └── utils/              # Utility functions
│   ├── server.js               # Server entry point
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                   # React + Vite browser extension
│   ├── src/
│   │   ├── popup/              # Extension popup UI
│   │   │   ├── popup.jsx       # Main popup component
│   │   │   └── popup.css       # Popup styles
│   │   ├── background.jsx      # Service worker (background script)
│   │   ├── App.jsx             # Root React component
│   │   ├── main.jsx            # React entry point
│   │   ├── App.css             # App styles
│   │   ├── index.css           # Global styles
│   │   └── assets/             # Static assets (images, icons)
│   ├── public/
│   │   ├── manifest.json       # Chrome extension manifest (v3)
│   │   └── vite.svg
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── package.json
│   └── package-lock.json
│
├── database/                   # Database files (planned)
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A modern browser (Chrome, Edge, Firefox, or Brave) for the extension

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MaskME
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd ../backend
touch .env  # On Windows: type nul > .env
```

Add the following to `backend/.env`:

```env
PORT=5000
```

(Optional: Add other environment variables like database URLs, API keys, etc. as needed)

---

## 💻 Usage

### Running Locally (Development)

#### Option 1: Run Backend + Frontend Separately

**Terminal 1 - Start Backend Server:**

```bash
cd backend
node server.js
```

You should see:
```
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend Dev Server:**

```bash
cd frontend
npm run dev
```

The frontend will typically run on `http://localhost:5173` (Vite default port).

#### Option 2: Test Backend API Directly

You can test the backend API using curl or any HTTP client:

```bash
# Generate an alias
curl http://localhost:5000/api/alias/generate
```

Expected response:
```json
{
  "alias": "user-a83f91@maskme.io"
}
```

### Running as a Browser Extension

#### Step 1: Build the Extension

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with the compiled extension files.

#### Step 2: Load Extension in Chrome/Edge

1. Open your browser and navigate to:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`

2. Enable **Developer mode** (toggle in top-right corner)

3. Click **"Load unpacked"** button

4. Navigate to and select the `frontend/dist` folder:
   ```
   MaskME/frontend/dist
   ```

5. The MaskME extension should now appear in your extensions list

#### Step 3: Use the Extension

1. Click the MaskME extension icon in your browser toolbar
2. The popup will open (make sure your backend is running on `http://localhost:5000`)
3. Click to generate a new alias
4. Copy and use the generated alias when signing up for services

#### Step 4: Update Extension After Code Changes

After making changes to the frontend code:

```bash
cd frontend
npm run build
```

Then in the browser:
1. Go to `chrome://extensions/` (or `edge://extensions/`)
2. Click the **refresh icon** on the MaskME extension card

### Production Build

For production deployment:

**Backend:**
- Set up environment variables on your hosting platform
- Deploy to services like Heroku, Railway, Render, or AWS
- Update the frontend API endpoint to point to your production backend URL

**Frontend:**
- Build the extension: `npm run build`
- Package the `dist/` folder as a `.zip` file
- Submit to Chrome Web Store or Edge Add-ons store

---

## 🔧 Development Scripts

### Backend

```bash
cd backend
node server.js          # Start the server
```

### Frontend

```bash
cd frontend
npm run dev            # Start Vite dev server (for testing UI)
npm run build          # Build extension for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```
