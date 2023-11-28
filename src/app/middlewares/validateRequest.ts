import { AnyZodObject } from "zod"
import { NextFunction, Request, Response } from 'express'

// Higher Order Functions
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod Validation
      await schema.parseAsync({
        body: req.body,
      })
      return next()
    } catch (err) {
      next(err)
    }
  }
}

export default validateRequest