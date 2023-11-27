// Creating students
const createStudent = async (req: Request, res: Response) => {
  try {
    //** creating a schema validation using Zod */
    const { student: studentData } = req.body

    //! validation using Zod validator package
    const zodValidatedData = studentValidationSchema.parse(studentData)
    const result = await StudentServices.createStudentIntoDB(zodValidatedData)

    res.status(200).json({
      success: true,
      message: 'Student is created Succefully',
      data: result,
    })
  } catch (err: string) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    })
  }
}