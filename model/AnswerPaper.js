import sequelize from '../db/quiz-xdml'
import DataType from 'sequelize';

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
});

AnswerPaper.sync()
module.exports = AnswerPaper;