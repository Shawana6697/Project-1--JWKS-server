// Import required modules as ESM
import createError from 'http-errors'
import express, { json, urlencoded } from 'express'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import authRouter from './routes/auth.mjs'
import jwksRouter from './routes/jwk.mjs'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(import.meta.url, 'public')))

app.use('/auth', authRouter)
app.use('/.well-known', jwksRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

app.set('keypairs', [])

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.json({ message: err.message, status: err.status })
})

export default app
