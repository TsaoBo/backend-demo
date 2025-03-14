const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser') // 把cookie轉為JS object,方便存取
const logger = require('morgan') // 看 request 訊息
const cors = require('cors')

const indexRouter = require('./routes/index')
const memberRouter = require('./routes/member')
const authRouter = require('./routes/auth')

const app = express()


app.use(logger('dev'))
app.use(cors())


app.use(express.json())
// 解析 html 表單提交的數據 (content-type = application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use('/', indexRouter)
app.use('/member', memberRouter)
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  
  res.status(err.status || 500).json({message:'error'})
})

module.exports = app
