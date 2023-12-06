import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import globalRouter from './app/routes'

const app: Application = express()

// Parser
app.use(express.json())
app.use(cors())
// application routes
app.use('/api/v1', globalRouter)

const test = async (req: Request, res: Response) => {
  const a = 10
  res.send(a)
}

app.get('/', test)
// Global error handler
app.use(globalErrorHandler)
app.use(notFound)

export default app
