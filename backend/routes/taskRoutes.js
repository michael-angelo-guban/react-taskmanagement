const express = require('express');
const { createTask, updateTaskStatus, getTasks } = require('../controllers/taskController');
const router = express.Router();

router.post('/tasks', createTask);
router.put('/tasks/:id', updateTaskStatus);
router.get('/tasks', getTasks);

module.exports = router;