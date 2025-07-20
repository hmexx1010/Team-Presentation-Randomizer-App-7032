# 🎤 Who Gets the Mic?

A playful web application for fairly selecting the next presenter from your team with AI-powered mic-drop reasons!

## ✨ Features

- **Fair Rotation**: No one can be selected twice until everyone has presented
- **AI-Powered Reasons**: GPT-4 generates quirky, one-sentence mic-drop reasons
- **Interactive UI**: Spinning microphone, confetti effects, and drum-roll sounds
- **Dark Mode**: Beautiful dark/light theme support
- **Accessibility**: Full keyboard navigation and WCAG-AA color contrast
- **Persistent State**: Uses localStorage to remember rotation history
- **Reset & Skip**: Manual controls for roster management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd who-gets-the-mic
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Add your OpenAI API key to .env (optional - will use fallback generator without it)
```

3. **Start development servers:**

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server:dev
```

4. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Frontend (React + Vite)
- **Components**: Modular React components with Framer Motion animations
- **Hooks**: Custom hooks for presenter rotation and dark mode
- **Utils**: Web Audio API for sound effects
- **Styling**: Tailwind CSS with dark mode support

### Backend (Node.js + Express)
- **API Endpoints**: 
  - `POST /api/mic-drop-reason` - Generate AI reasons
  - `GET /api/health` - Health check
- **AI Integration**: OpenAI GPT-4 API with fallback generator
- **CORS**: Configured for local development

### Data Persistence
- **localStorage**: Maintains fair rotation state across sessions
- **Fallback Logic**: Graceful degradation if AI API is unavailable

## 🎨 Customization

### Team Members
Edit the `TEAM_MEMBERS` array in `src/App.jsx`:
```javascript
const TEAM_MEMBERS = [
  'Your', 'Team', 'Members', 'Here'
];
```

### Styling
- Colors: Modify `tailwind.config.js`
- Animations: Adjust Framer Motion configs in components
- Sounds: Update `src/utils/sounds.js`

### AI Reasons
- **With OpenAI**: Set `OPENAI_API_KEY` in `.env`
- **Fallback**: Customize adjectives and templates in `server/index.js`

## 🚀 Deployment

### Vercel Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel
```

3. **Configure Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `OPENAI_API_KEY` (optional)
   - Add `NODE_ENV=production`

4. **Vercel Configuration** (automatic via `vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### Alternative Deployment Options

**Netlify:**
```bash
# Build
npm run build

# Deploy dist folder to Netlify
# Note: You'll need to deploy the backend separately (e.g., Railway, Render)
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

## 🎮 Usage

1. **Spin the Mic**: Click the main button to randomly select a presenter
2. **Watch the Show**: Enjoy the spinning animation, confetti, and sounds
3. **Read the Reason**: Get an AI-generated mic-drop reason
4. **Fair Rotation**: System ensures everyone presents before anyone goes twice
5. **Manual Controls**: Skip presenters or reset the rotation as needed
6. **Dark Mode**: Toggle between light and dark themes

## 🔧 Development

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run server:dev` - Start backend with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start production server

### Project Structure
```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── common/            # Shared components (SafeIcon)
└── App.jsx           # Main application

server/
└── index.js          # Express server

public/
└── mic-icon.svg      # Favicon
```

## 🎯 Accessibility Features

- **Keyboard Navigation**: Full tab navigation support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG-AA compliant colors
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user motion preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Team members
- Built with React, Vite, Express, and lots of ☕
- Powered by OpenAI's GPT-4 for creative mic-drop reasons

---

**Made with ❤️ for fair and fun presenter selection!**