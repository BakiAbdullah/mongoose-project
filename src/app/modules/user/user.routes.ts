import express, { NextFunction, Request, Response } from 'express'
import { UserControllers } from './user.controller'
import { createStudentValidationSchema } from '../student/student.zod.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

// Route will call controller functions
router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
)

export const UserRoutes = router
