# 📝 Todo API

A RESTful API built with Express.js, TypeScript, and Firestore for user authentication and task management.

## 🔧 Prerequisites

- Node.js (v14 or higher)
- Firebase project with Firestore enabled
- npm package manager

## 🚀 Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Configure Firebase credentials in `.env`
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Build

To build the project for production:

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory. After building, you can start the production server with:

```bash
npm start
```

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body**: `{ "email": "user@example.com" }`

#### Login
- **POST** `/auth/login`
- **Body**: `{ "email": "user@example.com" }`

#### Logout
- **GET** `/auth/logout`
- **Headers**: `Authorization: Bearer <token>`

### ✅ Task Endpoints

#### Get User Tasks
- **GET** `/tasks`
- **Headers**: `Authorization: Bearer <token>`

#### Create Task
- **POST** `/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "Task title" }`

#### Update Task
- **PUT** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "Updated title", "completed": true }`

## 🧪 Testing

Run auth tests:

```bash
npm test src/__tests__/auth.test.ts
```

Run task tests:

```bash
npm test src/__tests__/task.test.ts
```

## ⚙️ Environment Variables

- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRATION`: JWT token expiration time
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Firebase private key
- `FIREBASE_CLIENT_EMAIL`: Firebase client email