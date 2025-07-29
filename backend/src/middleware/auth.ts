import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // The actual authentication is handled in the GraphQL context
  // This middleware just ensures the request continues
  next();
}