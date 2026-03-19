const { Task, Project } = require('../models');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    const project = await Project.findByPk(project_id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await Task.create({
      project_id,
      title,
      description,
      status,
      priority,
      due_date
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { status, sort_by = 'due_date', order = 'ASC' } = req.query;

    const where = { project_id };
    if (status) where.status = status;

    const tasks = await Task.findAll({
      where,
      order: [[sort_by, order]]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const { title, description, status, priority, due_date } = req.body;
    await task.update({ title, description, status, priority, due_date });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
