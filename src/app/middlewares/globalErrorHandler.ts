import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { TErrorSources } from '../interface/error'
import config from '../config'
import handleZodErr from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import AppError from '../errors/AppError'
import { Error } from 'mongoose'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Setting default values
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ]

  //! Checking if the error is ZOD Error, using instanceof operator
  if (err instanceof ZodError) {
    const simplifiedError = handleZodErr(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err?.code === 1100) {
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorSources = simplifiedError?.errorSources
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err?.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }

  // Ultimate return of our custom error
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler

//? Our custom ErrorPattern
/*
 * Success:
 * message:
 * errorSources: [
 *    path: '',
 *    message: 'Something went wrong',
 * ]
 */
