import mongoose, { Schema, Document, Model } from 'mongoose'
import type { TransactionType, TransactionStatus } from '@/types'

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  policyId: mongoose.Types.ObjectId
  type: TransactionType
  amount: number
  status: TransactionStatus
  createdAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policyId: {
      type: Schema.Types.ObjectId,
      ref: 'Policy',
      required: true,
    },
    type: {
      type: String,
      enum: ['premium', 'claim_payout'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
)

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)

export default Transaction
