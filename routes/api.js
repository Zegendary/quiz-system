const {Quiz, AnswerPaper} = require('../model');
const express = require('express');
const router = express.Router();
const taskCenterDb = require('../db/task-center');

router.get('/courses',async (req, res, next) => {
  const {rows} = await taskCenterDb.query("SELECT id, name FROM courses WHERE name LIKE $1 limit 10", [`%${req.query.keyword}%`])
  res.send({data: rows})
})

router.get('/questions', async (req, res, next) => {
  const taskResults = await taskCenterDb.query("SELECT id FROM tasks WHERE course_id = ANY($1)", [req.query.courseIds])
  const taskIds = taskResults.rows.map(task => task.id)
  const quizResults = await taskCenterDb.query("SELECT answerable_id FROM task_quizzes WHERE task_id = ANY($1) and answerable_type = 'Quiz'", [taskIds])
  const quizIds = quizResults.rows.map(quiz => quiz.answerable_id)
  const questionsQueryString = `
      SELECT id, answerable_type, answerable_id
        FROM quiz_questions 
        WHERE quiz_id = ANY($1) and answerable_type in ('ChoiceQuestion', 'ClozeQuestion')
        LIMIT 10 OFFSET $2
    `
  const page = req.query.page || 1
  const {rows} = await taskCenterDb.query(questionsQueryString, [quizIds, (page - 1) * 10])
  const questionCount = await taskCenterDb.query("SELECT count(*) FROM quiz_questions WHERE quiz_id = ANY($1) and answerable_type = 'ChoiceQuestion'", [quizIds])
  // const questionCount = await taskCenterDb.query("SELECT count(*) FROM quiz_questions WHERE quiz_id = ANY($1) and answerable_type in ('ChoiceQuestion', 'ClozeQuestion')", [quizIds])
  const choiceQuestionIds = rows.filter(q => q.answerable_type === 'ChoiceQuestion').map(q => q.answerable_id)
  const choiceQuestions = await taskCenterDb.query("SELECT * FROM choice_questions WHERE id = ANY($1)", [choiceQuestionIds])
  const clozeQuestionIds = rows.filter(q => q.answerable_type === 'ClozeQuestion').map(q => q.answerable_id)
  const clozeQuestions = await taskCenterDb.query("SELECT * FROM cloze_questions WHERE id = ANY($1)", [clozeQuestionIds])
  const data = rows.map(question => {
    let answerable = null
    if(question.answerable_type === 'ChoiceQuestion'){
      answerable = choiceQuestions.rows.filter(c => c.id === question.answerable_id)[0]
    }else if(question.answerable_type === 'ClozeQuestion'){
      answerable = clozeQuestions.rows.filter(c => c.id === question.answerable_id)[0]
    }
    return {
      ...question,
      answerable
    }
  })

  res.send({questions: data, pager: {page: Number(page), totalCount: Number(questionCount.rows[0].count)}})
})

router.get('/quizzes', async (req, res, next) => {
  res.send({data: []})
})

router.post('/quizzes', async (req, res, next) => {
  const {questions, name} = req.body
  Quiz.create({
    name,
    creatorId: req.current_user.id,
    content: questions
  }).then((quiz) => {
    res.send({status: 0, quiz})
  }).catch(() => {
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

module.exports = router;