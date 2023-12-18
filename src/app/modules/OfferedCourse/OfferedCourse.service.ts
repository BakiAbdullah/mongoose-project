import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './OfferedCourse.interface'
import { OfferedCourseModel } from './OfferedCourse.model'
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { CourseFaculty } from '../course/course.model'
import { Faculty } from '../Faculty/faculty.model'
import { hasTimeConflict } from './OfferedCourse.utils'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload

  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration)
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester

  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty)
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }

  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findById(academicDepartment)
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }

  const isCourseExists = await CourseFaculty.findById(course)
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  // check if the department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty: academicFaculty,
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}`,
    )
  }

  // check if the same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisterSemesterWithSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    })

  if (isSameOfferedCourseExistsWithSameRegisterSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered Course with same section is already exists`,
    )
  }

  //? get the schedules of the faculties
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  // check if the faculty is available at that time. If not then throw error
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time! Choose other time or day`,
    )
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  })
  return result
  // return null
}

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'days' | 'faculty' | 'endTime' | 'startTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload

  const isOfferedCourseExists = await OfferedCourseModel.findById(id)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }
  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration
  //? get the schedules of the faculties

  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration)

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
    )
  }
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  // check if the faculty is available at that time. If not then throw error
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time! Choose other time or day`,
    )
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  })

  return result
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
}
