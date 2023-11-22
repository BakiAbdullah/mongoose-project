import { Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.validation'

// Creating students
const createStudent = async (req: Request, res: Response) => {
  try {
    //! creating a schema validation using Joi

    const { student: studentData } = req.body

    //! validation using Joi validator package
    const { error, value } = studentValidationSchema.validate(studentData)

    const result = await StudentServices.createStudentIntoDB(value)
    // console.log({error}, {value})

    if (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.details,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Student is created Succefully',
      data: result,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    })
  }
}

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
  createStudent,
  getAllStudents,
  getSingleStudent,
}

//** Controller function will handle only service logic (It will just take request and will send response and dont care about which database or ORM is used) */;
