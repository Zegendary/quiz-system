const {Quiz, AnswerPaper, QuizSnapshot} = require('../model');
const express = require('express');
const router = express.Router();
const taskCenterDb = require('../db/task-center');
const Sequelize = require('sequelize')
const _ = require('lodash')

router.get('/courses',async (req, res, next) => {
  if(req.current_user.role_mask !== 0){
    const {rows} = await taskCenterDb.query("SELECT id, name FROM courses WHERE name LIKE $1 limit 10", [`%${req.query.keyword}%`])
    res.send({data: rows})
  }else{
    res.send({status: 1,errorMsg: '你没有权限获取列表'})
  }
})

router.get('/questions', async (req, res, next) => {

  if(req.current_user.role_mask === 0){
    res.send({status: 1,errorMsg: '你没有权限获取列表'})
  }

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
  const queryParams = {...req.query}
  delete queryParams.page
  Quiz.findAndCountAll({
      offset: (req.query.page-1 || 0) * 10,
      limit: 10,
    order: [['createdAt', 'DESC']],
      include: [{model: AnswerPaper}],
      attributes: {
        exclude: ['questions'],
      },
      where: queryParams
  }).then((result) => {
    res.send({
      status: 0,
      quizzes: result.rows,
      page: req.query.page || 1,
      totalCount: result.count
    })
  }).catch((e) => {
    console.log(e)
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  })
})

router.post('/quizzes', async (req, res, next) => {
  const {questions, name, description} = req.body
  try {
    const quizSnapshot = await QuizSnapshot.create({questions: questions})
    const quiz = await Quiz.create({
      name,
      description,
      creatorId: req.current_user.id,
      questions: questions,
      quizSnapshotId: quizSnapshot.id
    })
    res.send({status: 0, quiz})
  } catch (e) {
    console.log(e)
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  }
})

router.put('/quizzes/:id', async (req, res, next) => {
  const {id, questions, name, description} = req.body
  try {
    const quizSnapshot = await QuizSnapshot.create({questions: questions})
    const quizzes = await Quiz.update({
      name,
      description,
      creatorId: req.current_user.id,
      questions: questions,
      quizSnapshotId: quizSnapshot.id
    },{
      where: {
        id: id
      }
    })
    res.send({status: 0, quiz: quizzes[0]})
  } catch (e) {
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  }
})

router.get('/quizzes/:id', async (req, res, next) => {
  try{
    const quizzes = await Quiz.findAll({
      where: {id: req.params.id}
    })
    const questions = quizzes[0].questions.map(c => {
      return {
        ...c,
        options: c.options.map(o => {return {text: o.text}}),
        answers: null
      }
    })
    const quiz = {
      ...quizzes[0].dataValues,
      questions,
    }
    res.send({status: 0, quiz: quiz})
  }catch (e) {
    console.log(e)
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  }
})

router.post('/answerPapers', async (req, res, next) => {
  const {answers, quizId, quizSnapshotId} = req.body
  const quizSnapshots = await QuizSnapshot.findAll({
    where: {id: quizSnapshotId}
  })
  // test answers
  const marks = []
  quizSnapshots[0].questions.forEach((c,index) => {
    if (c.type === 'ChoiceQuestion'){
      const correctAnswers = c.options.filter(o => o["correct"]).map(o => o.text)
      if(_.isEqual(answers[index].choices.sort(),correctAnswers.sort())){
        marks.push(true)
      }else{
        marks.push(false)
      }
    }else{
      if(c.answers.include(answers[index].answer)){
        marks.push(true)
      }else{
        marks.push(false)
      }
    }
  })
  try{
    const answerPaper = await AnswerPaper.create({
      creatorId: req.current_user.id,
      answers,
      marks,
      quizSnapshotId,
      quizId
    })
    res.send({status: 0, answerPaper, quizSnapshot: quizSnapshots[0]})
  }catch (e) {
    console.log(e)
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  }
})

router.get('/answerPapers', async (req, res, next) => {
  const queryParams = {...req.query}
  delete queryParams.page
  try {
    const result = await AnswerPaper.findAndCountAll({
      offset: (req.query.page-1 || 0) * 10,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Quiz,
        attributes: {
          exclude: ['questions'],
        }
      }],
      where: queryParams
    })
    const userIds = result.rows.map(r => r.dataValues.creatorId)
    const {rows} = await taskCenterDb.query("SELECT * FROM users WHERE id = ANY($1)", [userIds])
    const answerPapers = result.rows.map(r => {
      const creator = rows.filter(row => row.id === r.dataValues.creatorId)[0]
      return {
        ...r.dataValues,
        creatorName: creator.nickname || creator.phone,
        creatorAvatar: creator.avatar
      }
    })

    res.send({
      status: 0,
      answerPapers: answerPapers,
      page: req.query.page || 1,
      totalCount: result.count
    })
  }catch (e) {
    console.log(e)
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  }
})

router.get('/answerPapers/:id', async (req, res, next) => {
  try{
    const answerPapers = await AnswerPaper.findAll({
      where: {id: req.params.id}
    })
    const answerPaper = answerPapers[0]
    const quizSnapshots = await QuizSnapshot.findAll({
      where: {id: answerPaper.quizSnapshotId}
    })
    const quiz = await Quiz.findAll({
      where: {id: answerPaper.quizId},

    })
    res.send({status: 0, answerPaper, quizSnapshot: quizSnapshots[0], quiz: quiz[0]})
  }catch (e) {
    console.log(e)
    res.send({status: 1,errorMsg: '数据库异常或者你没有权限'});
  }
})


module.exports = router;