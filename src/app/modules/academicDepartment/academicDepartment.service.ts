import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartmentModel } from './academicDepartment.model'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartmentModel.create(payload)
  return result
}

const getAllAcademicDepartmentsFromDB = async () => {
  const result =
    await AcademicDepartmentModel.find().populate('academicFaculty')
  return result
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result =
    await AcademicDepartmentModel.findById(id).populate('academicFaculty')
  return result
}

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartmentModel.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  )

  return result
}

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
}
