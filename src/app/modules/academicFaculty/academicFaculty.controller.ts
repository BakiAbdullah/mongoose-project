import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { academicFacultyServices } from './academicFaculty.service'

const createAcademicFaculty = catchAsync(async (req, res) => {
  const facultyData = req.body
  const result =
    await academicFacultyServices.createAcademicFacultyIntoDB(facultyData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is Created Succesfully!',
    data: result,
  })
})

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.getAllAcademicFacultiesFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculties are retrieved successfully!',
    data: result,
  })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const result =
    await academicFacultyServices.getSingleAcademicFacultyFromDB(facultyId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is retrieved succesfully',
    data: result,
  })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const result = await academicFacultyServices.updateAcademicFacultyIntoDB(
    facultyId,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is updated succesfully',
    data: result,
  })
})

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
}
