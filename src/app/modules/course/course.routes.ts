import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidations } from './course.validation'
import { CourseControllers } from './course.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
)

router.get('/:id', CourseControllers.getSingleCourse)

router.patch(
  '/:id',
  auth('admin', 'faculty', 'student'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
)

router.delete('/:id', CourseControllers.deleteCourse)

router.put(
  '/:courseId/assign-faculties',
  auth('admin'),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
)

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourseFromDB,
)

router.get('/', CourseControllers.getAllCourses)

export const CourseRoutes = router
