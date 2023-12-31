import mongoose from 'mongoose'
import { User } from '../user/user.model'
import { TStudent } from './student.interface'
import { Student } from './student.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { studentSearchableFields } from './student.constant'
import QueryBuilder from '../../builder/QueryBuilder'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query } // copy of query object
  //! {email: { $regex: query.searchTerm, $options: i}}

  // let searchTerm = ''

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string
  // }

  //? Main query
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // })

  //? Filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']

  // excludeFields.forEach((el) => delete queryObj[el])

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   })

  //? Sorting
  // let sort = '-createdAt'
  // if (query.sort) {
  //   sort = query.sort as string
  // }

  // const sortQuery = filterQuery.sort(sort)

  // let page = 1
  // let limit = 1
  // let skip = 0
  // if (query.limit) {
  //   limit = Number(query.limit)
  // }
  // if (query.page) {
  //   page = Number(query.page)
  //   skip = (page - 1) * limit
  // }

  // const paginateQuery = sortQuery.skip(skip)

  // const limitQuery = paginateQuery.limit(limit)

  //? field limiting
  // { query: { fields: 'name,email' } } { queryObj: { fields: 'name,email' } }

  // let fields = '-__v'

  // if (fields) {
  //   fields = (query.fields as string).split(',').join(' ')
  //   console.log({fields})
  // }

  // const fieldQuery = await limitQuery.select(fields)

  // return fieldQuery

  //? Now that we have a QueryBuilder class, we can use it here

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    // .paginate()
    .fields()

  const meta = await studentQuery.countTotal()
  const result = await studentQuery.modelQuery
  return {
    result,
    meta,
  }
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    })
  return result
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  }

  /*
    guardain: {
      fatherOccupation:"Teacher"
    }
    guardian.fatherOccupation = Teacher
    name.firstName = 'Mezba'
    name.lastName = 'Abedin'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value
    }
  }

  console.log(modifiedUpdatedData)

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student')
    }

    // get user _id from deletedStudent
    const userId = deletedStudent.user

    const deletedUser = await User.findByIdAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedStudent
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student')
  }
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
}
