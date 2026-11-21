import app from './app';
import config from './config/config';
import connectDB from './db/connection';
import { createServer } from 'http';
import { initializeWebSocket } from './websocket/websocket';

// Connect to MongoDB
connectDB();

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket
initializeWebSocket(httpServer);

// Start the server
httpServer.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${config.port}`);
});