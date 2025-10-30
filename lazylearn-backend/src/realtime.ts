
import { createServer, Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient, RedisClientType } from 'redis';
import { Express } from 'express';

const REDIS_CHANNEL = 'focus-events';

export class RealtimeService {
  private httpServer: HttpServer;
  private wss: WebSocketServer;
  private redisPublisher: RedisClientType;
  private redisSubscriber: RedisClientType;
  // In-memory mapping of session ID to a set of WebSocket clients
  private sessionClients: Map<string, Set<WebSocket>> = new Map();

  constructor(app: Express) {
    this.httpServer = createServer(app);
    this.wss = new WebSocketServer({ server: this.httpServer });

    // Initialize Redis clients
    this.redisPublisher = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.redisSubscriber = this.redisPublisher.duplicate();

    this.connectClients();
    this.setupWebSocketConnection();
  }

  private async connectClients() {
    try {
      await this.redisPublisher.connect();
      await this.redisSubscriber.connect();
      console.log('Redis clients connected successfully.');
      this.subscribeToChannel();
    } catch (err) {
      console.error('Failed to connect to Redis', err);
    }
  }

  private setupWebSocketConnection() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      // Example: ws://localhost:3001?sessionId=some-session-id
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const sessionId = url.searchParams.get('sessionId');

      if (!sessionId) {
        console.log('Connection attempt without sessionId. Closing.');
        ws.close();
        return;
      }

      console.log(`Client connected to session: ${sessionId}`);

      // Add client to the session's client set
      if (!this.sessionClients.has(sessionId)) {
        this.sessionClients.set(sessionId, new Set());
      }
      this.sessionClients.get(sessionId)?.add(ws);

      ws.on('close', () => {
        console.log(`Client disconnected from session: ${sessionId}`);
        this.sessionClients.get(sessionId)?.delete(ws);
        // Clean up if no clients are left
        if (this.sessionClients.get(sessionId)?.size === 0) {
          this.sessionClients.delete(sessionId);
        }
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for session ${sessionId}:`, error);
      });
    });
  }

  private async subscribeToChannel() {
    console.log(`Subscribing to Redis channel: ${REDIS_CHANNEL}`);
    await this.redisSubscriber.subscribe(REDIS_CHANNEL, (message) => {
      try {
        const { sessionId, event, payload } = JSON.parse(message);
        console.log(`Received event from Redis: ${event} for session ${sessionId}`);

        const clients = this.sessionClients.get(sessionId);
        if (clients) {
          const eventMessage = JSON.stringify({ event, payload });
          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(eventMessage);
            }
          });
        }
      } catch (err) {
        console.error('Error processing message from Redis or broadcasting', err);
      }
    });
  }

  public async publishEvent(sessionId: string, event: string, payload: any) {
    const message = JSON.stringify({ sessionId, event, payload });
    console.log(`Publishing to ${REDIS_CHANNEL}: ${message}`);
    await this.redisPublisher.publish(REDIS_CHANNEL, message);
  }

  public listen(port: number, callback: () => void) {
    this.httpServer.listen(port, callback);
  }
}
