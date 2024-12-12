import Class from '../models/class';
import createHttpError from 'http-errors';

export async function getClasses(req, res, next) {
  try {
    const classes = await Class.find().populate('block', 'code');
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
      select: 'timeRange, level, course',
      populate: {
        path: 'class',
        select: 'code, fullCode, isAvailable',
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
