const sequelize = require('../db/quiz-xdml');
const Sequelize = require('sequelize');

const Model = Sequelize.Model;

class AnswerPaper extends Model{}

AnswerPaper.init({
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },

  answers: {
    type: Sequelize.JSON,
  },

  marks: {
    type: Sequelize.JSON,
  },

  creatorId: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
},{
  sequelize,
  modelName: 'answerPaper',
  timestamps: true
});

module.exports = AnswerPaper;