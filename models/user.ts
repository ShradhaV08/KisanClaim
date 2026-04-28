import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@/types'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
  address: {
    district: string
    state: string
    pincode: string
  }
  createdAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    address: {
      district: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
