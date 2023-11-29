import { Router } from 'express'
import { studentRoutes } from '../modules/student/student.route'
import { UserRoutes } from '../modules/user/user.routes'
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes'

const globalRouter = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes
  }
]

moduleRoutes.forEach((route) => globalRouter.use(route.path, route.route))

// router.use('/students', studentRoutes)
// router.use('/users', UserRoutes)

export default globalRouter
