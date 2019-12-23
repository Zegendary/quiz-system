const sequelize = require('../db/quiz-xdml');
const Sequelize = require('sequelize');

const Model = Sequelize.Model;

class Quiz extends Model{}

Quiz.init({
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },

  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  questions: {
    type: Sequelize.JSON,
    defaultValue: {},
  },

  creatorId: {
    type: Sequelize.UUID,
    primaryKey: true,
  },

  duration: {
    type: Sequelize.INTEGER,
  },
}, {
  sequelize,
  modelName: 'quiz',
  timestamps: true
});

module.exports = Quiz;