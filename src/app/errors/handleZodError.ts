import { ZodError, ZodIssue } from 'zod'
import { TErrorSources, TGenericErrorResponse } from '../interface/error'

//? Global zod error handler
const handleZodErr = (err: ZodError): TGenericErrorResponse => {
  let errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path?.length - 1],
      message: issue?.message,
    }
  })
  const statusCode = 400

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  }
}

export default handleZodErr
