import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { updateStudentValidationSchema } from './student.zod.validation'
import auth from '../../middlewares/auth'

const router = express.Router()

// route will call controller functions
router.get('/', StudentControllers.getAllStudents)
router.get('/:id', auth('admin', 'faculty'), StudentControllers.getSingleStudent)
router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  StudentControllers.updateStudent,
)
router.delete('/:id', StudentControllers.deleteStudent)

export const StudentRoutes = router
