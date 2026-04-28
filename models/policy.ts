import mongoose, { Schema, Document, Model } from 'mongoose'
import type { PolicyStatus } from '@/types'

export interface IPolicy extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  planId: mongoose.Types.ObjectId
  status: PolicyStatus
  premium: number
  startDate: Date
  endDate: Date
  cropType: string
  landSize: number
  location: string
}

const PolicySchema = new Schema<IPolicy>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    premium: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    landSize: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema)

export default Policy
