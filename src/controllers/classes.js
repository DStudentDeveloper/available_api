import Class from '../models/class.js';
import createHttpError from 'http-errors';
import Block from '../models/block.js';

export async function createClass(req, res, next) {
  const { blockId, code } = req.body;

  if (!blockId || !code) {
    return next(
      createHttpError(400, 'Missing required fields: classId, blockId, code')
    );
  }

  try {
    const block = await Block.findById(blockId);
    if (!block) return next(createHttpError(404, 'Block not found'));

    const class_ = new Class({
      block: blockId,
      code,
      fullCode: `${block.code} ${code}`,
    });

    await class_.save();
    block.classes.push(class_._id);
    await block.save();
    return res.status(201).json(class_);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}

export async function getAllClasses(req, res, next) {
  try {
    const classes = await Class.find()
      .populate('block', 'code')
      .sort({ code: 1 });
    if (!classes) return next(createHttpError(404, 'Classes not found'));

    return res.json(classes);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}

export async function getClassById(req, res, next) {
  const { id } = req.params;
  if (!id) return next(createHttpError(400, 'Class id is required'));

  try {
    const class_ = await Class.findById(id).populate('block', 'code');
    if (!class_) return next(createHttpError(404, 'Class not found'));

    return res.json(class_);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}

export async function getClassBookings(req, res, next) {
  const { id } = req.params;
  if (!id) return next(createHttpError(400, 'Class id is required'));

  try {
    const class_ = await Class.findById(id).populate({
      path: 'bookings',
      match: { 'timeRange.end': { $gte: new Date() } },
      select: 'timeRange level course',
      populate: {
        path: 'class',
        select: 'code fullCode',
        populate: { path: 'block', select: 'code' },
      },
    });

    if (!class_) return next(createHttpError(404, 'Class not found'));

    return res.json(class_.bookings);
  } catch (error) {
    console.trace(error);
    next(error);
  }
}
