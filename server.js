const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const taskCenterDb = require('./db/task-center');

app.prepare().then(() => {
  const server = express()

  server.get('/api/courses', async (req, res) => {
    const {rows} = await taskCenterDb.query("SELECT id, name FROM courses WHERE name LIKE $1 limit 10", [`%${req.query.keyword}%`])
    res.send({data: rows})
  })

  server.get('/api/questions', async (req, res) => {
    console.log(req.query.courseIds)

    // const {rows} = await taskCenterDb.query("SELECT id, name FROM courses WHERE name LIKE $1 limit 10", [`%${req.query.keyword}%`])


    res.send({data: [], pager: {page: 1, totalCount: 1}})
  })

  server.get('/api/quizzes', async (req, res) => {
    console.log(req.query.courseIds)
    // const {rows} = await taskCenterDb.query("SELECT id, name FROM courses WHERE name LIKE $1 limit 10", [`%${req.query.keyword}%`])
    res.send({data: []})
  })

  server.get('/', (req, res) => {
    console.log(req)
    console.log(res)
    return app.render(req, res, '/', req.query)
  })

  server.get('/dashboard', (req, res) => {
    return app.render(req, res, '/dashboard', req.query)
  })

  server.get('/quiz/:id', (req, res) => {
    return app.render(req, res, '/quiz', { id: req.params.id })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})