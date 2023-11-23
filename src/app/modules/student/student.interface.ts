// import { Schema, model, connect } from 'mongoose';
import { Model } from "mongoose"

// 1. Create a student type or interface representing a document in MongoDB.
export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TGuardian = {
  fatherName: string
  fatherOcupation: string
  fatherContactNo: string
  motherName: string
  motherOcupation: string
  motherContactNo: string
}

export type TLocalGuardian ={
  name: string
  occupation: string
  contactNo: string
  address: string
}

export type TStudent = {
  id: string
  name: TUserName
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  guardian: TGuardian
  localGuardian: TLocalGuardian
  profileImg?: string
  isActive: 'active' | 'blocked'
}


//& for creating Static methods
export interface StudentModel extends Model<TStudent> {
 isUserExists(id: string): Promise<TStudent | null>
}




//* for creating Instance methods
// export type StudentMethods = { 
//   isUserExists(id: string): Promise<TStudent | null>
// }

// Create a new Model type that knows about IUserMethods...
// export type StudentModel = Model<TStudent, Record<string, never>, StudentMethods>;