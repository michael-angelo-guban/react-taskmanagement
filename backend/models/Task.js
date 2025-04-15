const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    assignedUser: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('To Do', 'In Progress', 'Complete'),
        defaultValue: 'To Do',
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    buildingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Task;