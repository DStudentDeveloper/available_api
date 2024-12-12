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
      end: Date,
    },
    course: String,
    level: String,
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function () {
  if (!this.timeRange.end) {
    this.timeRange.end = new Date(
      this.timeRange.start.getTime() + 60 * 60 * 1000
    ); // Default 1 hour
  }
});

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

const Booking = model('Booking', bookingSchema);
export default Booking;
