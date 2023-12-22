import mongoose from 'mongoose'
import config from '../../config'
import { TAcademicSemester } from '../academicSemester/academicSemester.interface'
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { Faculty } from '../Faculty/faculty.model'
import { TFaculty } from '../Faculty/faculty.interface'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { TAdmin } from '../Admin/admin.interface'
import { Admin } from '../Admin/admin.model'
import { verifyToken } from '../Auth/auth.utils'
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary'

// Service function will handle only Business logic */
const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  // Create a user object and set student role
  const userData: Partial<TUser> = {}

  // if password is not provided, use default password
  userData.password = password || (config.default_pass as string)
  // Set student role
  userData.role = 'student'
  userData.email = payload?.email

  // Find Academic Semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  )

  //** Transaction & RollBack */
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set generated id for student
    //! userData.id = await generateStudentId(admissionSemester) --> This line was Throwing error
    if (admissionSemester) {
      userData.id = await generateStudentId(admissionSemester)
    }

    //? Custom mixed image name
    const imageName = `${userData.id}${payload?.name?.firstName}`

    //? path for image
    const path = file?.path

    //?send image to cloudinary
    const {secure_url} =  await sendImageToCloudinary(imageName, path)

    //* create a user // (Transaction-1)
    const newUser = await User.create([userData], { session }) //! Transaction use krar jnno newUser akhn Array hobe

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!')
    }
    //set id, _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //? reference _id
    payload.profileImg = secure_url

    //* create a student // (Transaction-2)
    const newStudent = await Student.create([payload], { session })

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!')
    }

    await session.commitTransaction()
    await session.endSession()

    return newStudent
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error)
  }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string)

  //set faculty role
  userData.role = 'faculty'
  //set faculty email address
  userData.email = payload?.email

  // find academic department info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateFacultyId()

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }) // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session })

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
    }

    await session.commitTransaction()
    await session.endSession()

    return newFaculty
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string)

  //set admin role
  userData.role = 'admin'
  //set admin email
  userData.email = payload?.email

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateAdminId()

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session })

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session })

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }

    await session.commitTransaction()
    await session.endSession()

    return newAdmin
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string)

  // const { userId, role } = decoded
  // console.log({ userId }, { role })

  let result = null
  if (role === 'student') {
    result = await Student.findOne({ id: userId })
      .populate('user')
      .populate('admissionSemester')
      .populate('academicDepartment')
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user')
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user')
  }
  // const result = await

  return result
}

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  })

  return result
}

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
}
