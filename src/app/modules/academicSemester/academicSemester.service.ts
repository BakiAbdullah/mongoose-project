import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { academicSemesterNameCodeMapper } from './academicSemester.const'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemesterModel } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  //! Semester name --> semester code (Academic Semester Logical Validation) (Business logic)

  // academicSemesterNameCodeMapper['Fall'] = '03'
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Invalid Semester Code!')
  }
  const result = await AcademicSemesterModel.create(payload)
  return result
}

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemesterModel.find()
  return result
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id)
  return result
}

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Invalid Semester Code')
  }

  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  )
  return result
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB
}
