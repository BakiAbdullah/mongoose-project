import { NextFunction, Request, Response } from 'express'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

// Getting all students
const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()
    res.status(200).json({
      success: true,
      message: 'Students are retrieved Succefully',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

// getting a single Student

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrieved Succefully!',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
}

//** Controller function will handle only service logic (req, res) (It will just take request and will send response and dont care about which database or ORM is used) */;
