const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  assignLabour,
  updateProjectStatus,
  addWorkUpdate,
} = require('../controllers/projectController');

router.get('/', getProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.post('/:id/assign', protect, assignLabour);
router.put('/:id/status', protect, updateProjectStatus);
router.post('/:id/updates', protect, addWorkUpdate);

module.exports = router;
