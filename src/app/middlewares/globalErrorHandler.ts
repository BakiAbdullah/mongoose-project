import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSource } from '../interface/error'
import config from '../config'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Setting default values
  let statusCode = err.statusCode || 500
  let message = err.message || 'Something went wrong!'

  //? Default values error
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ]

  //? Global zod error handler
  const handleZodErr = (err: ZodError) => {
    const statusCode = 400

    let errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue?.path?.length - 1],
        message: issue?.message,
      }
    })

    return {
      statusCode,
      message: 'Validation Error',
      errorSources,
    }
  }

  //! Checking if the error is ZOD Error using instanceof operator
  if (err instanceof ZodError) {
    const simplifiedError = handleZodErr(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  }

  // Ultimate return
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler

//? Our custom ErrorPattern
/**
 * Success:
 * message:
   errorSources: [
    path: '',
    message: 'Something went wrong',
  ]
 */
