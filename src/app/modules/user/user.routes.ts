import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

// Route will call controller functions
router.post('/create-student', UserControllers.createStudent)

export const UserRoutes = router