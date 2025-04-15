import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Select, MenuItem, Grid, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format, differenceInHours, isBefore } from 'date-fns';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenuItemCustomize = styled(MenuItem)({
  fontSize: '0.7rem',
});

const TextFieldCustomize = styled(TextField)({
  margin: 0,
  '& .MuiOutlinedInput-input': {
    fontSize: '0.7rem',
  },
  '& .MuiInputLabel-formControl': {
    fontSize: '0.7rem',
  },
});

function App() {
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleCreateTask = async () => {
    const taskData = {
      title: taskTitle,
      assignedUser,
      status,
      dueDate,
      buildingId
    };
    await axios.post('http://localhost:5000/api/tasks', taskData);
    fetchTasks();
    setTaskTitle('');
    setAssignedUser('');
    setStatus('To Do');
    setDueDate('');
    setBuildingId('');
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks');
    setTasks(res.data);
    checkForReminders(res.data);
  };

  const checkForReminders = (tasks) => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.status === 'To Do' || task.status === 'In Progress') {
        const taskDueDate = new Date(task.dueDate);
        const hoursDifference = differenceInHours(taskDueDate, now);

        if (isBefore(taskDueDate, now)) {
          toast.error(`Task "${task.title}" is overdue!`);
        } else if (hoursDifference <= 24) {
          toast.warn(`Task "${task.title}" is due within 24 hours!`);
        }
      }
    });
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>Task Management</Typography>
      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid item xs={12} sm={6}>
          <TextFieldCustomize
            label="Task Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldCustomize
            label="Assigned User"
            variant="outlined"
            fullWidth
            margin="normal"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: '0.7rem' }}
          >
            <MenuItemCustomize value="To Do">To Do</MenuItemCustomize>
            <MenuItemCustomize value="In Progress">In Progress</MenuItemCustomize>
            <MenuItemCustomize value="Complete">Complete</MenuItemCustomize>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldCustomize
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextFieldCustomize
            label="Building ID"
            type="number"
            fullWidth
            margin="normal"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateTask} 
            fullWidth
            disabled={!taskTitle || !assignedUser || !dueDate || !buildingId}
          >
            Create Task
          </Button>
        </Grid>
      </Grid>
      <div>
        <Typography sx={{ marginTop: 3 }} variant="h4" gutterBottom>Tasks</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Assigned User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.assignedUser}</TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      sx={{ fontSize: '0.7rem' }}
                    >
                      <MenuItemCustomize value="To Do">To Do</MenuItemCustomize>
                      <MenuItemCustomize value="In Progress">In Progress</MenuItemCustomize>
                      <MenuItemCustomize value="Complete">Complete</MenuItemCustomize>
                    </Select>
                  </TableCell>
                  <TableCell>{format(new Date(task.dueDate), 'yyyy-MM-dd')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

export default App;