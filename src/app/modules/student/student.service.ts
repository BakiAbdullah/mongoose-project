import { StudentModel } from '../student.model'
import { Student } from './student.interface'

// Service function will handle only Business logic */
const createStudentIntoDB = async (student: Student) => {
  const result = await StudentModel.create(student)
  return result
}

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
}
