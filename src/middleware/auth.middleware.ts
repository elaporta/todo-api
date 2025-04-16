// dependencies
import { Request, Response, NextFunction } from 'express';

// services
import { AuthService } from '../services/auth.service';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const payload = await AuthService.verifyToken(token);
    req.user = payload;

    next();
  }
  catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};