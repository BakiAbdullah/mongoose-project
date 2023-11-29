import { z } from 'zod'

const createAcademicSemesterValidationSchema = z.object({
 body: z.object({
  name: 
 })
})

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
}
