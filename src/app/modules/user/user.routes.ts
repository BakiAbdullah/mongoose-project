import express from 'express';

const router = express.Router();

// route will call controller functions
router.post('/create-student', UserControllers.createStudent)

export const UserRoutes = router