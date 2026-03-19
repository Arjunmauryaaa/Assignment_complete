const Joi = require('joi');

const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null)
});

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in-progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  due_date: Joi.date().iso().allow(null)
});

exports.validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

exports.validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
