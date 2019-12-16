const express = require('express')
const next = require('next')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const api = require('./api')

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(cookieParser());
  // api
  server.use('/api', api)

  // view
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