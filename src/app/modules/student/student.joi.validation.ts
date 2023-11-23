import Joi from 'joi'
import validator from 'validator'

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]*$/, { name: 'capitalize' })
    .message('{VALUE} is not in capitalize format'),
  middleName: Joi.string().trim(),
  lastName: Joi.string()
    .required()
    .trim()
    .custom((value) => {
      if (!validator.isAlpha(value)) {
        return '{VALUE} is not valid'
      }
      return value
    }),
})

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOcupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOcupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
})

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
})

const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().required().valid('male', 'female', 'other'),
  dateOfBirth: Joi.string(),
  email: Joi.string().required().email(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
})

export default studentValidationSchema


