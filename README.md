
# NotifyDo - Task Management Application

A full-stack task management application with user authentication and CRUD operations for tasks.

## Features

- User registration and authentication
- Create, read, update, and delete tasks
- Set task priorities, due dates, and tags
- Mark tasks as completed
- Filter and sort tasks

## Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- ShadcnUI components
- React Query
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
/todo-app
├── backend
│   ├── models - MongoDB schemas
│   ├── routes - API routes
│   ├── controllers - Route controllers
│   └── middleware - Auth middleware
├── src
│   ├── components - UI components
│   ├── pages - App pages
│   ├── context - React context
│   ├── services - API service
│   └── types - TypeScript types
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install frontend dependencies:
```
npm install
```

3. Install backend dependencies:
```
cd backend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Running the application

1. Start the backend:
```
cd backend
npm run dev
```

2. Start the frontend:
```
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Register a new account or login with existing credentials
2. Create new tasks with title, description, priority, due date, and tags
3. View your tasks, filter, and sort them
4. Mark tasks as complete when done
5. Edit or delete tasks as needed
