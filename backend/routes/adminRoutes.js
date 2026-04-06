const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getEmployees,
  approveEmployee,
  assignTask,
  getAllTasks,
  getDashboardStats,
  deleteTask,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', adminLogin);
router.get('/employees', protect, adminOnly, getEmployees);
router.put('/approve/:id', protect, adminOnly, approveEmployee);
router.post('/assign-task', protect, adminOnly, assignTask);
router.get('/tasks', protect, adminOnly, getAllTasks);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.delete('/tasks/:id', protect, adminOnly, deleteTask);

module.exports = router;
