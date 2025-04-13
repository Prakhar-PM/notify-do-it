
const express = require('express');
const router = express.Router();
const { getTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get all tasks & create new task
router.route('/')
  .get(getTasks)
  .post(createTask);

// Get, update, and delete task by ID
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
