import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import init from './database/database'
import env from 'dotenv'
import userRoute from './routes/user.route'
import regionRoute from './routes/regions.route'

const app = express()
const port = process.env.PORT

env.config()
init()

app.get('/terms', (req, res) => {
  const termsOfService = {
    title: 'Termos de Serviço',
    content:
      'Ao utilizar este serviço, você concorda com os seguintes termos:\n\n1. Você é responsável por manter a confidencialidade de suas credenciais de conta.\n2. Não deve violar as leis aplicáveis ao utilizar este serviço.\n3. Respeite os direitos de propriedade intelectual de terceiros.\n4. Não publique conteúdo ofensivo, ilegal ou prejudicial.\n5. Reservamo-nos o direito de suspender ou encerrar sua conta por violação destes termos.\n\nEstes termos podem ser atualizados periodicamente, e você será notificado sobre quaisquer alterações. Ao continuar a utilizar o serviço após as alterações, você aceita os termos revisados.',
  }
  return res.json(termsOfService)
})

app.use(express.json())
app.use('/v1/user', userRoute)
app.use('/v1/region', regionRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
