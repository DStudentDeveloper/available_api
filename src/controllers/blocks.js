import Block from '../models/block.js';
import createHttpError from 'http-errors';

export async function getBlocks(req, res, next) {
  try {
    const blocks = await Block.find().populate(
      'classes',
      'fullCode, code, isAvailable'
    );
    if (!blocks) return next(createHttpError(404, 'Blocks not found'));

    return res.json(blocks);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}

export async function getBlockById(req, res, next) {
  const { id } = req.params;
  if (!id) return next(createHttpError(400, 'Block id is required'));
  try {
    const block = await Block.findById(id).populate(
      'classes',
      'fullCode, code, isAvailable'
    );
    if (!block) return next(createHttpError(404, 'Block not found'));

    return res.json(block);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}
