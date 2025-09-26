# Pixame - Collaborative Pixel Art Platform

A real-time collaborative pixel art platform built with Taubyte backend and React frontend.

## Features

- **Real-time Canvas**: Collaborative pixel drawing with WebSocket updates
- **Live Chat**: Real-time messaging between users
- **Color Picker**: 16-color palette for pixel art
- **User Management**: Customizable usernames
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend (Taubyte)

- **Go SDK**: Serverless functions with `//export` comments
- **Database**: Key-value storage for pixels and chat messages
- **Pub/Sub**: Real-time messaging with "canvas" and "chat" channels
- **WebSocket**: Built-in WebSocket support for real-time updates

### Frontend (React + Vite)

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **WebSocket**: Real-time communication with backend

## Project Structure

```
pixame_game/
├── tb_library_backend/          # Taubyte backend
│   ├── .taubyte/
│   │   ├── config.yaml         # Taubyte configuration
│   │   └── build.sh            # Build script
│   ├── main.go                 # Main entry point
│   ├── types.go                # Data structures
│   ├── utils.go                # Utility functions
│   ├── database.go             # Database operations
│   ├── pubsub.go               # Pub/Sub handlers
│   ├── canvas.go               # Canvas API endpoints
│   ├── chat.go                 # Chat API endpoints
│   └── go.mod                  # Go dependencies
└── tb_website_pixame/          # React frontend
    ├── .taubyte/
    │   ├── config.yaml         # Taubyte configuration
    │   └── build.sh            # Build script
    ├── src/
    │   ├── components/         # React components
    │   ├── services/           # API and WebSocket services
    │   ├── types.ts            # TypeScript types
    │   └── App.tsx             # Main app component
    ├── package.json            # Node.js dependencies
    └── vite.config.ts          # Vite configuration
```

## Backend API Endpoints

### Canvas Endpoints

- `POST /drawPixel` - Draw a pixel on the canvas
- `GET /getPixel?x={x}&y={y}` - Get a specific pixel
- `GET /getCanvas` - Get all pixels on the canvas

### Chat Endpoints

- `POST /sendMessage` - Send a chat message
- `GET /getMessages` - Get all chat messages

### WebSocket Endpoints

- `GET /getWebSocketURL?type=canvas` - Get canvas WebSocket URL
- `GET /getWebSocketURL?type=chat` - Get chat WebSocket URL

### Utility Endpoints

- `GET /health` - Health check

## Pub/Sub Channels

- **canvas**: Real-time pixel updates
- **chat**: Real-time chat messages

## Databases

- **/canvas**: Stores pixel data
- **/chat**: Stores chat messages

## Development

### Backend Development

1. **Build and Test**:

   ```bash
   cd tb_library_backend
   go mod tidy
   go build .
   ```

2. **Docker Build** (for Taubyte deployment):
   ```bash
   docker run -it --rm \
     -v "$(pwd)/out:/out" \
     --mount type=bind,src="$(pwd)",dst=/src_ro,ro \
     --mount type=tmpfs,dst=/src \
     taubyte/go-wasi /bin/bash -c '
       set -e
       rsync -a --delete /src_ro/ /src/ 2>/dev/null || cp -a /src_ro/. /src/
       echo "cd /src; source /utils/wasm.sh" > /tmp/cowrc
       exec bash --rcfile /tmp/cowrc -i'
   ```

### Frontend Development

1. **Install Dependencies**:

   ```bash
   cd tb_website_pixame
   npm install
   ```

2. **Development Server**:

   ```bash
   npm run dev
   ```

3. **Build**:

   ```bash
   npm run build
   ```

4. **Docker Build** (for Taubyte deployment):
   ```bash
   docker run -it --rm \
     -v "$(pwd)/out:/out" \
     --mount type=bind,src="$(pwd)",dst=/src_ro,ro \
     --mount type=tmpfs,dst=/src \
     node:18.14.1-bullseye /bin/bash -c '
       set -e
       rsync -a --delete /src_ro/ /src/ 2>/dev/null || cp -a /src_ro/. /src/
       cd /src
       npm install
       npm run build
       mv dist/* /out
       exit 0'
   ```

## Deployment

### Taubyte Dashboard Deployment

1. **Import Backend**:

   - Upload `tb_library_backend` to Taubyte Dashboard
   - Configure function triggers for HTTP endpoints
   - Set up databases: `/canvas` and `/chat`
   - Create pub/sub channels: `canvas` and `chat`

2. **Import Frontend**:

   - Upload `tb_website_pixame` to Taubyte Dashboard
   - Configure static hosting
   - Update API_BASE_URL in `src/services/api.ts`

3. **Configure Domains**:
   - Set up custom domains for backend and frontend
   - Configure CORS settings

## Configuration

### Backend Configuration

- **Module**: `function`
- **Go Version**: `1.19`
- **SDK Version**: `v0.3.9`
- **Database**: Key-value storage
- **Pub/Sub**: Real-time messaging

### Frontend Configuration

- **React**: `18.2.0`
- **TypeScript**: `5.2.2`
- **Vite**: `5.0.8`
- **Tailwind CSS**: `3.3.6`

## Usage

1. **Start Drawing**: Select a color and click on the canvas
2. **Chat**: Type messages in the chat panel
3. **Real-time Updates**: See other users' pixels and messages instantly
4. **Customize**: Change your username and canvas settings

## Contributing

1. Follow Taubyte patterns and conventions
2. Use proper `//export` comments for backend functions
3. Maintain type safety in frontend code
4. Test both backend and frontend builds

## License

MIT License
