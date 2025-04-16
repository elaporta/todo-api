// dependencies
import { body } from 'express-validator';

// middlewares
import { validate } from '../middleware/validation.middleware';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  validate
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  validate
];