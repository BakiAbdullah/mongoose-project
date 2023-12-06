import { ZodError, ZodIssue } from "zod"
import { TErrorSources } from "../interface/error"

//? Global zod error handler
const handleZodErr = (err: ZodError) => {
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
