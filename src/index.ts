import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import init from './database/database'
import env from 'dotenv'
import userRoute from './routes/user.route'
import regionRoute from './routes/regions.route'

const app = express()
const port = process.env.PORT || 3000

env.config()
init()

app.get('/terms', (req, res) => {
  return res.json({
    message: 'Termos de Serviço',
  })
})

app.use(express.json())
app.use('/v1/user', userRoute)
app.use('/v1/region', regionRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
