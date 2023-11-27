import { NextFunction, Request, Response } from 'express'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

// Creating students
const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, student: studentData } = req.body

    // const zodValidatedData = studentValidationSchema.parse(studentData)
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
      data: result
    })
  } catch (err) {
    // res.status(500).json({
    //   success: false,
    //   message: err.message || 'Something went wrong',
    //   error: err,
    // })
    next(err)
  }
}

export const UserControllers = {
  createStudent,
}
