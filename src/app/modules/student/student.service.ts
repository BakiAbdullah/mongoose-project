import { Student } from '../student.model'
import { TStudent } from './student.interface'

// Service function will handle only Business logic */
const createStudentIntoDB = async (studentData: TStudent) => {
  //** static method */
  if (await Student.isUserExists(studentData.id)) {
    throw new Error(`Student already exists: ${studentData.id}`)
  }
  const result = await Student.create(studentData) //*** Built in static method ***/

  // const student = new Student(studentData) // create an instance of Student
  // if(await student.isUserExists(studentData.id)){
  //   throw new Error(`Student is already exists`)
  // }
  // const result = await student.save() // built-in instance method***/

  return result
}

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
  return result
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
}
