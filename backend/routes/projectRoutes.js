const express = require('express');
const router = express.Router();
const { createProject, getProjects, applyToProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.post('/:projectId/apply', protect, applyToProject);

module.exports = router;
