import * as express from 'express'
import * as bodyParser from 'body-parser'
import routes from './routes'
import initDatabase from './config/database'

const app = express()
const port = 3003

app.use(bodyParser.json())

app.use('/', routes)

initDatabase()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
