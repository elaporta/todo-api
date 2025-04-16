// dependencies
import request from 'supertest';
import app from '../index';

// services
import { AuthService } from '../services/auth.service';

describe('Auth Routes', () => {

  describe('POST /auth/register', () => {

    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register a user with invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {

    it('should login existing user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not login non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/logout', () => {
    let token: string;

    beforeEach(async () => {
      const result = await AuthService.loginUser('test@example.com');
      token = result.token;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .get('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/auth/logout');

      expect(response.status).toBe(401);
    });

    it('should not allow reuse of logged out token', async () => {
      // First logout
      await request(app)
        .get('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      // Try to use same token again
      const response = await request(app)
        .get('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
    });
  });
});