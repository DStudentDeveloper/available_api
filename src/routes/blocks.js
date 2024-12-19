import { Router } from 'express';
import {
  createBlock,
  getBlockById,
  getBlocks,
  getBlockClasses,
} from '../controllers/blocks.js';

const router = Router();

router.post('/', createBlock);
router.get('/', getBlocks);
router.get('/:id', getBlockById);
router.get('/:id/classes', getBlockClasses);

export default router;
