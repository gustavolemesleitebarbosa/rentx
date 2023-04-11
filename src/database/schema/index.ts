import { appSchema } from '@nozbe/watermelondb/Schema'
import { userSchema } from './userSchema'
import { carSchema } from './carSchema'

const schemas = appSchema({
  version:9,
  tables: [userSchema, carSchema]
})

export {schemas}