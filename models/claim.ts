import mongoose, { Schema, Document, Model } from 'mongoose'
import type { ClaimStatus, ClaimType } from '@/types'

export interface IClaim extends Document {
  _id: mongoose.Types.ObjectId
  policyId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  type: ClaimType
  description: string
  amount: number
  status: ClaimStatus
  documents: string[]
  fraudScore?: number
  submittedAt: Date
  updatedAt: Date
}

const ClaimSchema = new Schema<IClaim>(
  {
    policyId: {
      type: Schema.Types.ObjectId,
      ref: 'Policy',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['crop_damage', 'weather', 'pest', 'other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    documents: [{
      type: String,
    }],
    fraudScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Claim: Model<IClaim> = mongoose.models.Claim || mongoose.model<IClaim>('Claim', ClaimSchema)

export default Claim
