const express = require('express')
const next = require('next')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const api = require('./routes/api')
const jwt = require('jsonwebtoken')
const taskCenterDb = require('./db/task-center');


app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(cookieParser());

  const auth = async (req, res, next) => {
    let {user_id} = jwt.decode(req.cookies.x_jwt)
    const {rows} = await taskCenterDb.query("SELECT * FROM users WHERE id = $1", [user_id])
    const key = rows[0].last_sign_in_ip? (rows[0].encrypted_password + rows[0].last_sign_in_ip):rows[0].encrypted_password
    jwt.verify(req.cookies.x_jwt, key,(err, decoded)=>{
      if(err && !dev){
        return res.redirect(`https://xiedaimala.com/sign_in/?redirect_to=${req.originalUrl}`)
      }else{
        req.current_user = rows[0]
        res.current_user = rows[0]
        next()
      }
    })
  }
  // api
  server.use('/api', auth, api)

  // view
  server.get('/', auth, (req, res) => {
    return app.render(req, res, '/', req.query)
  })

  server.get('/dashboard', auth, (req, res) => {
    return app.render(req, res, '/dashboard', req.query)
  })


  server.get('/quizzes/:id', auth, (req, res) => {
    return app.render(req, res, '/quizShow', { id: req.params.id })
  })

  server.get('/createQuiz', auth, (req, res) => {
    return app.render(req, res, '/createQuiz')
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})