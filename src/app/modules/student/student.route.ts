import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.zod.validation'

const router = express.Router()

// route will call controller functions
router.get('/:studentId', StudentControllers.getSingleStudent)
router.patch(
  '/:studentId',
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateStudent,
)
router.delete('/:studentId', StudentControllers.deleteStudent)
router.get('/', StudentControllers.getAllStudents)

export const StudentRoutes = router

export const studentRoutes = router
