import { Router } from 'express'
import { StudentRoutes } from '../modules/student/student.route'
import { UserRoutes } from '../modules/user/user.routes'
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes'
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes'
import { AcademicDeparmentRoutes } from '../modules/academicDepartment/academicDepartment.routes'

const globalRouter = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDeparmentRoutes,
  },
]

moduleRoutes.forEach((route) => globalRouter?.use(route?.path, route?.route))
// router.use('/students', studentRoutes)
// router.use('/users', UserRoutes)

export default globalRouter
