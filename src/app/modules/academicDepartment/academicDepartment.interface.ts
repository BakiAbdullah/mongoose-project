import { Types } from 'mongoose'

export type TAcademicDepartment = {
  name: string
  academicFaculty: Types.ObjectId // It will create a new reference named `academicfaculty`
}
