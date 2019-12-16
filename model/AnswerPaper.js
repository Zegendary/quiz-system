const sequelize = require('../db/quiz-xdml');
const DataType = require('sequelize');

const AnswerPaper = sequelize.define('answerPaper', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  content: {
    type: DataType.JSON,
  },

  creatorId: {
    type: DataType.UUID,
    primaryKey: true,
  },
},{
  timestamps: true
});

AnswerPaper.sync()
module.exports = AnswerPaper;