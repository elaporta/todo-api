// dependencies
import request from 'supertest';
import app from '../index';

// services
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';

describe('Task Routes', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const result = await AuthService.loginUser('test@example.com');
    token = result.token;
    userId = result.user.id;
  });

  describe('GET /tasks', () => {
    it('should return user tasks', async () => {
      await TaskService.createTask(userId, 'Test task');

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('title', 'Test task');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New test task',
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(response.body).toHaveProperty('title', taskData.title);
      expect(response.body).toHaveProperty('user_id', userId);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task', async () => {
      const task = await TaskService.createTask(userId, 'Test task');

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated task', completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Updated task');
      expect(response.body).toHaveProperty('completed', true);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task', async () => {
      const task = await TaskService.createTask(userId, 'Test task');

      const response = await request(app)
        .delete(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verify task is actually deleted
      const deletedTask = await TaskService.getUserTasks(userId);
      expect(deletedTask.find(t => t.id === task.id)).toBeUndefined();
    });
  });
});