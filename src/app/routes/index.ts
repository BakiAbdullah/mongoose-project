import { Router } from 'express'
import { studentRoutes } from '../modules/student/student.route'
import { UserRoutes } from '../modules/user/user.routes'

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
]

moduleRoutes.forEach((route) => globalRouter.use(route.path, route.route))

// router.use('/students', studentRoutes)
// router.use('/users', UserRoutes)

export default globalRouter