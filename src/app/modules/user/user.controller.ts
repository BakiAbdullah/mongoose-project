import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../errors/AppError'

// Creating students
const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body

  const result = await UserServices.createStudentIntoDB(password, studentData)
  // res.status(200).json({
  //   success: true,
  //   message: 'Student is created Succefully',
  //   data: result,
  // })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created Succefully',
    data: result,
  })
})

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body

  const result = await UserServices.createFacultyIntoDB(password, facultyData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  })
})

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body

  const result = await UserServices.createAdminIntoDB(password, adminData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  })
})

const getMe = catchAsync(async (req, res) => {
  // const token = req.headers.authorization

  // if (!token) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Token not found')
  // }

  const { userId, role } = req.user
  const result = await UserServices.getMe(userId, role)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  })
})

const changeStatus = catchAsync(async (req, res) => {
  const id  = req.params.id
  const result = await UserServices.changeStatus(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  })
})

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
}
