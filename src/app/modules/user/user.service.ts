import config from '../../config'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'

// Service function will handle only Business logic */
const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // Create a user object and set student role
  const userData: Partial<TUser> = {}

  // if password is not provided, use default password
  userData.password = password || (config.default_pass as string)
  // Set student role
  userData.role = 'student'
  //set manually generated id for student
  userData.id = '2030100001'
  // create a user
  const newUser = await User.create(userData)

  // create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user
    studentData.id = newUser.id
    studentData.user = newUser._id //? reference _id

    const newStudent = await Student.create(studentData)
    return newStudent
  }
}

export const UserServices = {
  createStudentIntoDB,
}
