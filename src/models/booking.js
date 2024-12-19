import { Schema, model } from 'mongoose';
import Class from './class';

const bookingSchema = new Schema(
  {
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    timeRange: {
      start: { type: Date, required: true },
      end: {
        type: Date,
        default: function () {
          return new Date(this.timeRange.start.getTime() + 60 * 60 * 1000); // Default to 1 hour later
        },
      },
    },
    course: String,
    level: String,
  },
  { timestamps: true }
);

bookingSchema.post('remove', async function () {
  const classItem = await Class.findById(this.class);
  if (classItem) {
    classItem.bookings = classItem.bookings.filter(
      (bookingId) => !bookingId.equals(this._id)
    );
    if (classItem.bookings.length === 0) {
      classItem.isAvailable = true;
    }
    await classItem.save();
  }
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = model('Booking', bookingSchema);
export default Booking;
