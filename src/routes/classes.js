import { Router } from 'express';
import {
  createClass,
  getClassById,
  getAllClasses,
  getClassBookings,
} from '../controllers/classes.js';

const router = Router();

router.post('/', createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.get('/:id/bookings', getClassBookings);

export default router;
