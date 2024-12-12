import Class from '../models/class.js';

export async function notifyBookingChange(io, classId) {
  const class_ = await Class.findById(classId).populate('bookings');

  const now = new Date();
  const validBookings = class_.bookings.filter((b) => now < b.timeRange.end);

  io.to(`class-${classId}`).emit('bookingUpdate', {
    classId,
    bookings: validBookings,
  });
}
