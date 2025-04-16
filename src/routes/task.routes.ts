// dependencies
import { Router, Request, Response } from 'express';

// services
import { TaskService } from '../services/task.service';

// middlewares
import { authenticate } from '../middleware/auth.middleware';

// validators
import { updateTaskValidation } from '../validators/task.validator';
import { createTaskValidation } from '../validators/task.validator';

const router = Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getUserTasks(req.user!.userId);

    res.json(tasks);
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', [authenticate, ...createTaskValidation], async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const task = await TaskService.createTask(req.user!.userId, title);

    res.status(201).json(task);
  }
  catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', [authenticate, ...updateTaskValidation], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await TaskService.updateTask(id, req.user!.userId, updates);

    res.json(task);
  }
  catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;