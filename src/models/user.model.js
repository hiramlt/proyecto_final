import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
  rol: { type: String, default: 'usuario' },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);