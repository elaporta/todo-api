// dependencies
import { body } from 'express-validator';

// middlewares
import { validate } from '../middleware/validation.middleware';

export const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title cannot be empty'),
  validate
];

export const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean value'),
  validate
];