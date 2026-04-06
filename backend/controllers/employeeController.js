const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Task = require('../models/Task');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register employee
// @route   POST /api/employee/register
const registerEmployee = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const employee = await Employee.create({ name, email, password, department: department || 'General' });
    res.status(201).json({
      message: 'Registration successful! Please wait for admin approval.',
      employee: { id: employee._id, name: employee.name, email: employee.email, isApproved: employee.isApproved },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Employee login
// @route   POST /api/employee/login
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const employee = await Employee.findOne({ email });
    if (!employee || !(await employee.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!employee.isApproved) {
      return res.status(403).json({ message: 'Your account is pending admin approval. Please wait.' });
    }

    const token = generateToken(employee._id, 'employee');
    res.json({
      token,
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: 'employee',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get employee tasks
// @route   GET /api/employee/tasks
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/employee/update-task/:id
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not assigned to you' });
    }

    task.status = status;
    await task.save();
    res.json({ message: 'Task status updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get employee stats
// @route   GET /api/employee/stats
const getMyStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ assignedTo: req.user.id });
    const completedTasks = await Task.countDocuments({ assignedTo: req.user.id, status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ assignedTo: req.user.id, status: 'In Progress' });
    const pendingTasks = await Task.countDocuments({ assignedTo: req.user.id, status: 'Pending' });

    res.json({ totalTasks, completedTasks, inProgressTasks, pendingTasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerEmployee, loginEmployee, getMyTasks, updateTaskStatus, getMyStats };
