import { z } from 'zod'

export const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Academic Faculty must be string' }),
  }),
})

export const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Academic Faculty must be string' }),
  }),
})

export const AcademicFacultyValidation = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
}
