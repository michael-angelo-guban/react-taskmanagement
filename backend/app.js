const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', taskRoutes);

// Connect to DB and start server
sequelize.sync().then(() => {
    console.log('Database connected');
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
}).catch(err => console.log('Database connection failed:', err));