import express = require('express')
import init from './database/database'
import env = require('dotenv')

import userRoute from './routes/user.route'
import regionRoute from './routes/regions.route'

const app = express()
const port = process.env.PORT || 3000

env.config()
init()

app.use(express.json())
app.use('/user', userRoute)
app.use('/region', regionRoute)

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
