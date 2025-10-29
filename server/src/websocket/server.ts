import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

import { getRedisClient } from '../services/redisClient';

interface ClubUser {
  userId: string;
  clubId: string;
}

export async function createSocketServer(server: HttpServer) {
  const redis = await getRedisClient();
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const subscriber = redis.duplicate();
  await subscriber.connect();

  subscriber.pSubscribe('chat:*', (message, channel) => {
    const clubId = channel.split(':')[1];
    io.to(`club:${clubId}`).emit('club:message', JSON.parse(message));
  });

  io.on('connection', (socket) => {
    socket.on('join', ({ clubId, userId }: ClubUser) => {
      socket.join(`club:${clubId}`);
      socket.data.clubId = clubId;
      socket.data.userId = userId;
    });

    socket.on('leave', () => {
      if (socket.data.clubId) {
        socket.leave(`club:${socket.data.clubId}`);
      }
    });

    socket.on('disconnect', () => {
      if (socket.data.clubId) {
        socket.leave(`club:${socket.data.clubId}`);
      }
    });
  });

  return io;
}
