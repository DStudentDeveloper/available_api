import Block from '../models/block.js';
import createHttpError from 'http-errors';

export async function createBlock(req, res, next) {
  const { code } = req.body;

  if (!code) {
    return next(createHttpError(400, 'Missing required field: code'));
  }

  try {
    const block = new Block({ code });
    await block.save();
    return res.status(201).json(block);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}

export async function getBlocks(req, res, next) {
  try {
    const blocks = await Block.find()
      .populate('classes', 'fullCode, code, isAvailable')
      .sort({ code: 1 });
    if (!blocks) return next(createHttpError(404, 'Blocks not found'));

    return res.json(blocks);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}

export async function getBlockClasses(req, res, next) {
  const { id } = req.params;

  if (!id) return next(createHttpError(400, 'Block id is required'));
  try {
    const block = await Block.findById(id)
      .populate({
        path: 'classes',
        populate: { path: 'block', select: 'code' },
      })
      .sort({ code: 1 });

    if (!block) return next(createHttpError(404, 'Block not found'));

    return res.json(block.classes);
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
