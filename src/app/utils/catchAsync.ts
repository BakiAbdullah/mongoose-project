import { NextFunction, Request, RequestHandler, Response } from 'express'

// To avoid try catch repetation, we are using catch async HOF functions utils
export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }
}
