import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'

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

export const UserControllers = {
  createStudent,
}
