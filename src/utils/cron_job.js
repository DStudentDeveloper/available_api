import Booking from '../models/booking.js';
import cron from 'node-cron';
import { notifyBookingChange } from '../helpers/booking_change_notifier_handler.js';
import Class from '../models/class.js';

export default function setupCronJobs(io) {
  cron.schedule('0 * * * *', async () => {
    // Runs every hour at the start of the hour
    const now = new Date();
    const expiredBookings = await Booking.find({
      'timeRange.end': { $lt: now },
    });

    for (const booking of expiredBookings) {
      const classItem = await Class.findById(booking.class);

      if (!classItem) continue;

      // Remove the expired booking from the class's bookings list
      classItem.bookings = classItem.bookings.filter(
        (bookingId) => !bookingId.equals(booking._id)
      );
      await booking.deleteOne(); // Delete the booking
      await classItem.save(); // Save updated class

      // Notify clients about the updated bookings for this class
      await notifyBookingChange(io, classItem._id);
    }

    console.log(`${expiredBookings.length} expired bookings cleaned.`, new Date());
  });
}
