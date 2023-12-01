import { Schema, model } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: 'AcademicFaculty' }, //? Will reference the AcademicFaculty
  },
  {
    timestamps: true,
  },
)

//! Check if the department is already exists or not using pre middleware hook
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartmentModel.findOne({
    name: this.name,
  })

  if (isDepartmentExist) {
    throw new Error(`${this.name} is already exists!`)
  }
  next()
})

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery()
  const isDepartmentExist = await AcademicDepartmentModel.findOne(query)
  if (!isDepartmentExist) {
    throw new Error(`This department doest not exists!`)
  }
  next()
})

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
)
