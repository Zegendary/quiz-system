const sequelize = require('../db/quiz-xdml');
const DataType = require('sequelize');

const Quiz = sequelize.define('quiz', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  name: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  content: {
    type: DataType.JSON,
    defaultValue: {},
  },

  creatorId: {
    type: DataType.UUID,
    primaryKey: true,
  },

  duration: {
    type: DataType.INTEGER,
  },
}, {
  timestamps: true
});

Quiz.sync()
module.exports = Quiz;