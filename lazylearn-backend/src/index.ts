
import express from 'express';
import focusRouter from './routes/focus';
import { RealtimeService } from './realtime'; // Import the RealtimeService

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Hello from the lazylearn backend!');
});

// Apply the focus router
app.use('/api/focus', focusRouter);

// Setup and start the server with real-time capabilities
const realtimeService = new RealtimeService(app);

realtimeService.listen(port, () => {
  console.log(`Backend server with WebSocket is running on http://localhost:${port}`);
});

