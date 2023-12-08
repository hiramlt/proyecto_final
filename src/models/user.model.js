import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  age: { type: Number },
  rol: { type: String, default: 'usuario' },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);