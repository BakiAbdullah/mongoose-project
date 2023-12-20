import { AnyZodObject } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'

// Higher Order Functions
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Zod Validation
    await schema.parseAsync({
      body: req.body,
    })
    next()
  })
}

export default validateRequest
