import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { CourseSearchableFields } from './course.constant'
import { TCourse } from './course.interface'
import { Course } from './course.model'
import mongoose from 'mongoose'

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload)
  return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .sort()
    // .paginate()
    .fields()
  const result = await courseQuery.modelQuery
  return result
}

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
}

//? Update Course Dynamically
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

   //step1: basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        // session,
      },
    );

    return updatedBasicCourseInfo

  // const session = await mongoose.startSession();

  // try {
  //   session.startTransaction();

  //   //step1: basic course info update
  //   const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
  //     id,
  //     courseRemainingData,
  //     {
  //       new: true,
  //       runValidators: true,
  //       session,
  //     },
  //   );

  //   if (!updatedBasicCourseInfo) {
  //     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  //   }

  //   // check if there is any pre requisite courses to update
  //   if (preRequisiteCourses && preRequisiteCourses.length > 0) {
  //     // filter out the deleted fields
  //     const deletedPreRequisites = preRequisiteCourses
  //       .filter((el) => el.course && el.isDeleted)
  //       .map((el) => el.course);

  //     const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
  //       id,
  //       {
  //         $pull: {
  //           preRequisiteCourses: { course: { $in: deletedPreRequisites } },
  //         },
  //       },
  //       {
  //         new: true,
  //         runValidators: true,
  //         session,
  //       },
  //     );

  //     if (!deletedPreRequisiteCourses) {
  //       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  //     }

  //     // filter out the new course fields
  //     const newPreRequisites = preRequisiteCourses?.filter(
  //       (el) => el.course && !el.isDeleted,
  //     );

  //     const newPreRequisiteCourses = await Course.findByIdAndUpdate(
  //       id,
  //       {
  //         $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
  //       },
  //       {
  //         new: true,
  //         runValidators: true,
  //         session,
  //       },
  //     );

  //     if (!newPreRequisiteCourses) {
  //       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  //     }

  //     const result = await Course.findById(id).populate(
  //       'preRequisiteCourses.course',
  //     );

  //     return result;
  //   }

  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (err) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  // }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
}
