import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPlan extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  description: string
  cropTypes: string[]
  regions: string[]
  premiumRange: {
    min: number
    max: number
  }
  coverageAmount: number
  benefits: string[]
  terms: string
  duration: number
  isActive: boolean
}

const PlanSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    cropTypes: [{
      type: String,
      required: true,
    }],
    regions: [{
      type: String,
      required: true,
    }],
    premiumRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    benefits: [{
      type: String,
    }],
    terms: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      required: true,
      default: 12,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Plan: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema)

export default Plan
