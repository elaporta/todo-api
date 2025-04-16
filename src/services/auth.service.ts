// dependencies
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import db from '../config/firebase';

// interfaces
import { User } from '../interfaces';
import { JwtPayload } from '../interfaces';

const USERCOLLECTION = 'users';
const INVALIDTOKENCOLLECTION = 'invalid_tokens';

export class AuthService {

  static async registerUser(email: string): Promise<{ user: User; token: string }> {
    const userQuery = await db.collection(USERCOLLECTION)
      .where('email', '==', email)
      .get();

    if (!userQuery.empty) throw new Error('User already exists');

    const now = new Date().toISOString().replace('T', ' ').split('.')[0];
    const user: User = {
      id: uuidv4(),
      email,
      created_at: now,
      updated_at: now,
    };

    await db.collection(USERCOLLECTION).doc(user.id).set(user);
    const token = this.generateToken(user);

    return { user, token };
  }

  static async loginUser(email: string): Promise<{ user: User; token: string }> {
    const userQuery = await db.collection(USERCOLLECTION)
      .where('email', '==', email)
      .get();

    if (userQuery.empty) throw new Error('User not found');

    const userDoc = userQuery.docs[0];
    const user = userDoc.data() as User;
    const token = this.generateToken(user);

    return { user, token };
  }

  static async logout(token: string): Promise<void> {
    await db.collection(INVALIDTOKENCOLLECTION).doc(token).set({
      invalidated_at: new Date().toISOString().replace('T', ' ').split('.')[0]
    });
  }

  static generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: +(process.env.JWT_EXPIRATION ?? '3600'),
    });
  }

  static async verifyToken(token: string): Promise<JwtPayload> {
    const invalidToken = await db.collection(INVALIDTOKENCOLLECTION).doc(token).get();
    if (invalidToken.exists) throw new Error('Invalid token');

    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    }
    catch (error) {
      throw new Error('Invalid token');
    }
  }
}