// const sequelize = require('../db/quiz-xdml');
const Quiz = require('./Quiz');
const AnswerPaper = require('./AnswerPaper');

Quiz.hasMany(AnswerPaper, {
  foreignKey: 'quizId',
  as: 'answerPapers',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});
//
// function sync(...args) {
//   return sequelize.sync(...args);
// }

module.exports = { Quiz, AnswerPaper };