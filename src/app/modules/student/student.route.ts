import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

// route will call controller functions
router.get('/', StudentControllers.getAllStudents)
router.get('/:studentId', StudentControllers.getSingleStudent)

export const studentRoutes = router