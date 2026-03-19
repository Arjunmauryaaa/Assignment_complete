const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { validateProject, validateTask } = require('../middleware/validator');

router.post('/', validateProject, projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.delete('/:id', projectController.deleteProject);

// Nested routes for tasks under a project
router.post('/:project_id/tasks', validateTask, taskController.createTask);
router.get('/:project_id/tasks', taskController.getTasks);

module.exports = router;
