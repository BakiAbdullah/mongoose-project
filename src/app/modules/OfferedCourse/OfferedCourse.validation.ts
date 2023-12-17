import { z } from 'zod';
import { Days } from './OfferedCourse.constant';

// const timeStringSchema = z.string().refine(
//   (time) => {
//     const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
//     return regex.test(time);
//   },
//   {
//     message: 'Invalid time format , expected "HH:MM" in 24 hours format',
//   },
// );

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string(), // HH: MM   00-23: 00-59
      endTime: z.string(),
    })
    .refine(
      (body) => {
        // startTime : 10:30  => 1970-01-01T10:30
        //endTime : 12:30  =>  1970-01-01T12:30

        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return end > start;
      },
      {
        message: 'Start time should be before End time !  ',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string().optional(),
      maxCapacity: z.number().optional(),
      days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
      startTime:  z.string().optional(), // HH: MM   00-23: 00-59
      endTime:  z.string().optional(),
    })
    // .refine(
    //   (body) => {
    //     // startTime : 10:30  => 1970-01-01T10:30
    //     //endTime : 12:30  =>  1970-01-01T12:30

    //     const start = new Date(`1970-01-01T${body.startTime}:00`);
    //     const end = new Date(`1970-01-01T${body.endTime}:00`);

    //     return end > start;
    //   },
    //   {
    //     message: 'Start time should be before End time !  ',
    //   },
    // ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};