// import { Schema, model, connect } from 'mongoose';

// 1. Create a student type or interface representing a document in MongoDB.
export type UserName = {
  firstName: string
  middleName: string
  lastName: string
}

export type Guardian = {
  fatherName: string
  fatherOcupation: string
  fatherContactNo: string
  motherName: string
  motherOcupation: string
  motherContactNo: string
}

export type LocalGuardian ={
  name: string
  occupation: string
  contactNo: string
  address: string
}

export type Student = {
  id: string
  name: UserName
  gender: 'male' | 'female'
  dateOfBirth?: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  guardian: Guardian
  localGuardian: LocalGuardian
  profileImg?: string
  isActive: 'active' | 'blocked'
}

