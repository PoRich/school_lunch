require('dotenv').config()
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
const authenticateJwt = require('./authenticate-jwt')
const { passKnexSecured } = require('./database/dynamic-knex')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var lunchWeekRouter = require('./routes/lunch-week')
var lunchWeekPublicRouter = require('./routes/lunch-week-public')

var app = express()
app.use(cors())
app.options('*', cors()) // allows preflight for POST, PUT, DELETE
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

var router = express.Router()

router.use('/', indexRouter)
router.use('/users', usersRouter)
router.use('/lunch-week-public', lunchWeekPublicRouter)
router.use('/lunch-week', [authenticateJwt, passKnexSecured], lunchWeekRouter) // all routes in /lunch-week are protected by JWT

app.use('/api', router)

// fallback route to index.html
app.use('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
module.exports = app
