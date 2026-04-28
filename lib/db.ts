// In-memory database - no external dependencies needed
// All data operations are handled by the `db` object in sample-data.ts
import { db } from './sample-data'

export default function dbConnect() {
  // No-op: using in-memory store
  return Promise.resolve()
}

export { db }
