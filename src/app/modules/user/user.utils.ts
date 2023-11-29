import { TAcademicSemester } from '../academicSemester/academicSemester.interface'

// year - semesterCode - 4 digit number
export const generateStudentId = (payload: TAcademicSemester) => {
  //first time 0000
  const currentId = (0).toString()
  let incrementId = Number(currentId + 1).toString().padStart(4, '0')

  incrementId = `${payload.year}${payload.code}${incrementId}`
  return incrementId
}
