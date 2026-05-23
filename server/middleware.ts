import { Request, Response, NextFunction } from 'express';
import { verifyToken, signToken } from './jwt.ts';
import { dbInstance } from './db.ts';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
  isAdmin?: boolean;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (decoded) {
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    // Check if the actual user is an Admin
    const user = dbInstance.getUserById(decoded.userId);
    if (user) {
      req.isAdmin = !!user.isAdmin;
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Admin access denied" });
  }
  next();
}
