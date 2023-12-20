import { Model } from "mongoose"
import { USER_ROLE } from "./user.constant"

// Step-1 (Create Interface)
export interface TUser {
  id: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'admin' | 'student' | 'faculty'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export interface UserModel extends Model<TUser>{
  isUserExistsByCustomId(id:string):Promise<TUser>;
  isPasswordMatched(plainTextPass: string, hashedPassword: string): Promise<boolean>
}

export type TUserRole = keyof typeof USER_ROLE