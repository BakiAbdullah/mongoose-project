import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

// route will call controller functions

router.post('/create-student', StudentControllers.createStudent)

export const studentRoutes = router