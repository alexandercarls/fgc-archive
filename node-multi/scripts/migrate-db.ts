import { db } from '../models/db'

db.migrate
  .latest()
  .then(() => {
    console.log('Database synced successfully!')
    process.exit(0)
  })
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
