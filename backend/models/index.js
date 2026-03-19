const sequelize = require('../config/database');
const Project = require('./Project');
const Task = require('./Task');

Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = {
  sequelize,
  Project,
  Task
};
