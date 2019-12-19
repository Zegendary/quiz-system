// const sequelize = require('../db/quiz-xdml');
const Quiz = require('./Quiz');
const AnswerPaper = require('./AnswerPaper');
const QuizSnapshot = require('./QuizSnapshot');

Quiz.hasMany(AnswerPaper);
AnswerPaper.belongsTo(Quiz);
Quiz.belongsTo(QuizSnapshot);
AnswerPaper.belongsTo(QuizSnapshot);
QuizSnapshot.hasOne(Quiz)
QuizSnapshot.hasMany(AnswerPaper)

Quiz.sync()
AnswerPaper.sync()
QuizSnapshot.sync()


module.exports = { Quiz, AnswerPaper, QuizSnapshot };