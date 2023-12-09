import { Schema, model } from "mongoose";
import { TCourse, TPreRequisiteCourses } from "./course.interface";


const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: {type: Schema.Types.ObjectId},
  isDeleted: {type: Boolean, default: false}
})

const courseSchema = new Schema<TCourse>({
  title: {type: String, unique: true, trim: true, required: true},
  prefix: {type: String, trim: true, required: true},
  code: {type: Number, trim: true, required: true},
  credits: {type: Number, trim: true, required: true},
  preRequisiteCourses: [preRequisiteCoursesSchema]
})

export const Course = model<TCourse>('Course', courseSchema)