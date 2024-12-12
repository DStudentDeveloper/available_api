import { Router } from 'express';
import {
  bookClass,
  patchBooking,
  cancelClass,
} from '../controllers/bookings.js';

const router = Router();

router.post('/', bookClass);
router.patch('/:id', patchBooking);
router.delete('/:id', cancelClass);

export default router;
