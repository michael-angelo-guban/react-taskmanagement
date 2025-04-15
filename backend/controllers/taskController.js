const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, assignedUser, status, dueDate, buildingId } = req.body;
        const task = await Task.create({
            title,
            assignedUser,
            status,
            dueDate,
            buildingId
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: 'Error creating task', error: err });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: 'Error updating task', error: err });
    }
};

// List tasks by building ID or assigned user
const getTasks = async (req, res) => {
    try {
        const { buildingId, assignedUser } = req.query;
        const conditions = {};
        if (buildingId) conditions.buildingId = buildingId;
        if (assignedUser) conditions.assignedUser = assignedUser;

        const tasks = await Task.findAll({ where: conditions });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving tasks', error: err });
    }
};

module.exports = { createTask, updateTaskStatus, getTasks };