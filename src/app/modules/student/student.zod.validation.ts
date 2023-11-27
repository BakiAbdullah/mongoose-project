import { z } from 'zod'
import validator from 'validator'

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20)
    .refine((value) => value[0].toUpperCase() + value.slice(1) === value, {
      message: 'First Name should start with a capital letter',
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1)
    .refine((value) => validator.isAlpha(value), {
      message: 'Last Name should contain only alphabetic characters',
    }),
})

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOcupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOcupation: z.string(),
  motherContactNo: z.string(),
})

const localGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
})

const studentValidationSchema = z.object({
  id: z.string(),
  name: userNameValidationSchema,
  password: z.string().max(20),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().optional(),
  email: z.string().email({ message: 'Invalid email format' }),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean().optional(),
})

export default studentValidationSchema
