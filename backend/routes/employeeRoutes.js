const express = require('express');
const router = express.Router();
const {
  registerEmployee,
  loginEmployee,
  getMyTasks,
  updateTaskStatus,
  getMyStats,
} = require('../controllers/employeeController');
const { protect, employeeOnly } = require('../middleware/auth');

router.post('/register', registerEmployee);
router.post('/login', loginEmployee);
router.get('/tasks', protect, employeeOnly, getMyTasks);
router.put('/update-task/:id', protect, employeeOnly, updateTaskStatus);
router.get('/stats', protect, employeeOnly, getMyStats);

module.exports = router;
