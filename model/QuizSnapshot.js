const sequelize = require('../db/quiz-xdml');
const Sequelize = require('sequelize');

const Model = Sequelize.Model;

class QuizSnapshot extends Model{}

QuizSnapshot.init({
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  content: {
    type: Sequelize.JSON,
    defaultValue: {},
  }
}, {
  sequelize,
  modelName: 'quizSnapshot',
  timestamps: true,
  underscored: true
});

module.exports = QuizSnapshot;