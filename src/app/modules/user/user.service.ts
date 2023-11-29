import config from '../../config'
import { TAcademicSemester } from '../academicSemester/academicSemester.interface'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import { generateStudentId } from './user.utils'

// Service function will handle only Business logic */
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // Create a user object and set student role
  const userData: Partial<TUser> = {}

  // if password is not provided, use default password
  userData.password = password || (config.default_pass as string)
  // Set student role
  userData.role = 'student'

  // Find Academic Semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  )

  //set generated id for student
  userData.id = generateStudentId(admissionSemester)

  // create a user
  const newUser = await User.create(userData)

  // create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user
    payload.id = newUser.id
    payload.user = newUser._id //? reference _id

    const newStudent = await Student.create(payload)
    return newStudent
  }
}

export const UserServices = {
  createStudentIntoDB,
}
