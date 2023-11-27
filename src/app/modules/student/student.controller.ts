import { Request, Response } from 'express'
import { StudentServices } from './student.service'

// Getting all students
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()
    res.status(200).json({
      success: true,
      message: 'Students are retrieved Succefully',
      data: result,
    })
  } catch (error) {
    console.log(error)
  }
}

// getting a single Student

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'Student is retrieved!',
      data: result,
    })
  } catch (error) {
    console.log(error)
  }
}

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
}

//** Controller function will handle only service logic (req, res) (It will just take request and will send response and dont care about which database or ORM is used) */;
