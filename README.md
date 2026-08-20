# Module Federation with Vite

This project demonstrates Module Federation using Vite 7 as the build tool.

## Project Structure

- `host/` - The host application that consumes remote modules (runs on port 5173)
- `remote/` - The remote application that exposes modules (runs on port 5001)

## Getting Started

### Quick Start (Recommended)

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

2. Start both applications:
   ```bash
   npm run dev
   ```

This will start both the remote and host applications simultaneously.

### Manual Start

1. Install dependencies for both applications:
   ```bash
   npm run install:all
   ```

2. Start the remote application (in one terminal):
   ```bash
   npm run dev:remote
   ```

3. Start the host application (in another terminal):
   ```bash
   npm run dev:host
   ```

## Access the Applications

- **Host Application**: http://localhost:5173
- **Remote Application**: http://localhost:5001

## How it Works

The remote application exposes a `Button` component that the host application consumes using React's `lazy` loading and `Suspense`. The Module Federation setup allows the host to dynamically load components from the remote application at runtime.

## Troubleshooting

If you encounter issues:

1. Make sure both applications are running on their respective ports
2. Check that the remote application's `remoteEntry.js` is accessible at http://localhost:5001/remoteEntry.js
3. Ensure CORS is enabled (already configured in the Vite configs)
4. Check the browser console for any Module Federation errors