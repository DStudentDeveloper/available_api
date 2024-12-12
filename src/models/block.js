import { Schema, model } from 'mongoose';

const blockSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  },
  { timestamps: true }
);

const Block = model('Block', blockSchema);
export default Block;
