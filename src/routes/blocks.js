import { Router } from 'express';
import { getBlockById, getBlocks } from '../controllers/blocks.js';

const router = Router();

router.get('/', getBlocks);
router.get('/:id', getBlockById);

export default router;
