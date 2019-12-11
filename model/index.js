import sequelize from '../sequelize';
import Quiz from './Quiz';
import AnswerPaper from './AnswerPaper';

Quiz.hasMany(AnswerPaper, {
  foreignKey: 'quizId',
  as: 'answerPapers',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Quiz, AnswerPaper };