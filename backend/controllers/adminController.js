const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const Task = require('../models/Task');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Admin login
// @route   POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(admin._id, 'admin');
    res.json({
      token,
      user: { id: admin._id, email: admin.email, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/admin/employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve employee
// @route   PUT /api/admin/approve/:id
const approveEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    employee.isApproved = !employee.isApproved;
    await employee.save();
    res.json({ message: `Employee ${employee.isApproved ? 'approved' : 'revoked'} successfully`, employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign task
// @route   POST /api/admin/assign-task
const assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: 'Please provide title, description, and assignee' });
    }

    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (!employee.isApproved) {
      return res.status(400).json({ message: 'Cannot assign task to unapproved employee' });
    }

    const task = await Task.create({ title, description, assignedTo, priority, dueDate });
    await task.populate('assignedTo', 'name email');
    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/admin/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const pendingApprovals = await Employee.countDocuments({ isApproved: false });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });

    res.json({
      totalEmployees,
      pendingApprovals,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/admin/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { adminLogin, getEmployees, approveEmployee, assignTask, getAllTasks, getDashboardStats, deleteTask };
