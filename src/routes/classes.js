import { Router } from 'express';
import {
  getClassById,
  getClasses,
  getClassBookings,
} from '../controllers/classes.js';

const router = Router();

router.get('/', getClasses);
router.get('/:id', getClassById);
router.get('/:id/bookings', getClassBookings);

export default router;
