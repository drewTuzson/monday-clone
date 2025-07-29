import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { prisma } from '../db/client';
import { redis } from '../db/redis';
import { verifyToken } from '../utils/auth';

export interface Context {
  prisma: PrismaClient;
  redis: Redis;
  user: {
    id: string;
    email: string;
  } | null;
  req: Request | null;
}

interface CreateContextParams {
  req: Request | null;
  connectionParams?: any;
}

export async function createContext({ req, connectionParams }: CreateContextParams): Promise<Context> {
  let user = null;

  // Extract token from request headers or connection params (for subscriptions)
  let token: string | undefined;
  
  if (req) {
    // HTTP request
    const authHeader = req.headers.authorization;
    token = authHeader?.replace('Bearer ', '');
  } else if (connectionParams?.authorization) {
    // WebSocket connection
    token = connectionParams.authorization.replace('Bearer ', '');
  }

  if (token) {
    try {
      const decoded = await verifyToken(token);
      if (decoded && typeof decoded !== 'string') {
        user = {
          id: decoded.userId,
          email: decoded.email,
        };
      }
    } catch (error) {
      // Invalid token, user remains null
    }
  }

  return {
    prisma,
    redis,
    user,
    req,
  };
}