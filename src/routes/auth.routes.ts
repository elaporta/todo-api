// dependencies
import { Router, Request, Response } from 'express';

// services
import { AuthService } from '../services/auth.service';

// middlewares
import { authenticate } from '../middleware/auth.middleware';

// validators
import { registerValidation, loginValidation } from '../validators/auth.validator';

const router = Router();

router.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await AuthService.registerUser(email);
    res.status(201).json(result);
  }
  catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await AuthService.loginUser(email);
    res.json(result);
  }
  catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    await AuthService.logout(token);
    res.json({ message: 'Logged out successfully' });
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;