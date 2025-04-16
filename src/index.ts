// dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// routes
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

// initialize environment variables
dotenv.config();

// initialize express app
const app = express();
const port = process.env.PORT || 3000;

// register middlewares
app.use(cors());
app.use(express.json());

// register routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// register error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;