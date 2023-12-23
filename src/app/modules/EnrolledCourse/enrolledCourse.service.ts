/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import EnrolledCourse from './enrolledCourse.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { OfferedCourseModel } from '../OfferedCourse/OfferedCourse.model'
import { Student } from '../student/student.model'
import mongoose from 'mongoose'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { Course } from '../course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { calculateGradeAndPoints } from './enrolledCourse.utils'

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  // Check if the offered cousres is exists
  const { offeredCourse } = payload

  const isOfferedCourseExists = await OfferedCourseModel.findById(offeredCourse)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !')
  }

  // Check if the max credits exceed
  if (isOfferedCourseExists?.maxCapacity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Room is full, max capacity exceeded !',
    )
  }

  // Check if the student is already enrolled
  const student = await Student.findOne({ id: userId }, { _id: 1 }) // <--- field filtering / select
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !')
  }
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  })

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !')
  }

  // check total credits exceeds maxCredit or not
  const course = await Course.findById(isOfferedCourseExists?.course)
  const currentCredit = course?.credits

  const semesterRegistrationsCredits = await SemesterRegistrationModel.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit')
  const maxCredit = semesterRegistrationsCredits?.maxCredit

  const enrolledCourses = await EnrolledCourse.aggregate([
    // stage-1
    {
      $match: {
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        student: student._id,
      },
    },
    // stage-2
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    // stage-3
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ])

  //! total enrolled credits + new enrolled course credit > maxCredit
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits !',
    )
  }

  //** Starting transaction and Rollback here because of many write operations
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    )

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in this course !',
      )
    }
    let maxCapacity = isOfferedCourseExists.maxCapacity
    await OfferedCourseModel.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    })
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload

  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration)

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found !',
    )
  }

  // Check if the offered cousres is exists
  const isOfferedCourseExists = await OfferedCourseModel.findById(offeredCourse)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !')
  }

  const isStudentExists = await Student.findById(student)
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !')
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !')
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  })

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden! !')
  }

  //*** Dynamic update starts here ***
  //** Dynamic update starts here **
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5)

    const result = calculateGradeAndPoints(totalMarks)

    // console.log({result} , {totalMarks})

    modifiedData.grade = result.grade
    modifiedData.gradePoints = result.gradePoints
    modifiedData.isCompleted = true
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  )

  return result
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
}
