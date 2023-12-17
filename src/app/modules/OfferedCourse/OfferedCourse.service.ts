import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './OfferedCourse.interface'
import { OfferedCourseModel } from './OfferedCourse.model'
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model'
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model'
import { CourseFaculty } from '../course/course.model'
import { Faculty } from '../Faculty/faculty.model'

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

  const isDepartmentBelongToFaculty =  await AcademicDepartmentModel.findOne({
    academicFaculty: academicFaculty,
    academicDepartment: academicDepartment
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, `${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}`)
  }

  const result = await OfferedCourseModel.create({...payload, academicSemester})
  return result
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
}
