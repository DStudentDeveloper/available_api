import { Schema, model } from 'mongoose';

const classSchema = new Schema(
  {
    block: { type: Schema.Types.ObjectId, ref: 'Block', required: true },
    code: { type: String, required: true },
    fullCode: { type: String, required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  },
  { timestamps: true }
);

const Class = model('Class', classSchema);
export default Class;
