import sequelize from '../db/quiz-xdml'
import DataType from 'sequelize';

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
});

Quiz.sync()
module.exports = Quiz;