import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'

// getting a single Student
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params
  const result = await StudentServices.getSingleStudentFromDB(studentId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved Succefully!',
    data: result,
  })
})

// Getting all students
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB()
  res.status(200).json({
    success: true,
    message: 'Students are retrieved Succefully',
    data: result,
  })
})

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
}

//** Controller function will handle only service logic (req, res) (It will just take request and will send response and dont care about which database or ORM is used) */;
