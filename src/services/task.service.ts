// dependencies	
import { v4 as uuidv4 } from 'uuid';
import db from '../config/firebase';

// interfaces
import { Task } from '../interfaces';

const TASKCOLLECTION = 'tasks';

export class TaskService {

  static async createTask(userId: string, title: string): Promise<Task> {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    const task: Task = {
      id: uuidv4(),
      user_id: userId,
      title,
      completed: false,
      created_at: now,
      updated_at: now,
    };

    await db.collection(TASKCOLLECTION).doc(task.id).set(task);

    return task;
  }

  static async getUserTasks(userId: string): Promise<Task[]> {
    const tasksQuery = await db.collection(TASKCOLLECTION)
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    return tasksQuery.docs.map(doc => doc.data() as Task);
  }

  static async updateTask(taskId: string, userId: string, updates: Partial<Task>): Promise<Task> {
    const taskDoc = await db.collection(TASKCOLLECTION).doc(taskId).get();
    
    if (!taskDoc.exists) throw new Error('Task not found');

    const task = taskDoc.data() as Task;

    if (task.user_id !== userId) throw new Error('Unauthorized');

    const updatedTask: Task = {
      ...task,
      ...updates,
      updated_at: new Date().toISOString().replace('T', ' ').split('.')[0],
    };

    await db.collection(TASKCOLLECTION).doc(taskId).update({...updatedTask});

    return updatedTask;
  }
}