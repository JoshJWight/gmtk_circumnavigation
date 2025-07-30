# Around the world in 96 hours

My project for GMTK Game Jam 2025: a game about circumnavigating the earth.

## Electron + React + TypeScript App

This is an Electron desktop application built with React and TypeScript.

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run electron-dev
   ```
   This starts the React dev server and opens the Electron app.

3. **Build for production:**
   ```bash
   npm run electron-pack
   ```
   This creates a distributable Electron app in the `dist/` folder.

### Project Structure

- `src/` - React + TypeScript application source code
  - `components/GameComponent.tsx` - Empty game component ready for your game logic
- `public/electron.js` - Main Electron process
- `public/index.html` - HTML template

### Available Scripts

- `npm start` - Start React development server only
- `npm run build` - Build React app for production
- `npm run electron` - Run Electron with built React app
- `npm run electron-dev` - Run in development mode (recommended)
- `npm run electron-pack` - Build distributable Electron app
