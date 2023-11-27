import { TStudent } from '../student/student.interface'
import { User } from './user.model'

// Service function will handle only Business logic */
const createStudentIntoDB = async (studentData: TStudent) => {
  // if (await Student.isUserExists(studentData.id)) {
  //   throw new Error(`Student already exists: ${studentData.id}`)
  // }
  const result = await User.create(studentData)
  return result
}

export const UserServices = {
  createStudentIntoDB,
}
