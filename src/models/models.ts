import 'reflect-metadata'

import * as mongoose from 'mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Prop, getModelForClass } from '@typegoose/typegoose'

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new mongoose.Types.ObjectId().toString() })
  _id: string
}

export class User extends Base {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true, unique: true })
  email!: string

  @Prop({ required: false })
  address?: string

  @Prop({ required: false, type: () => [Number] })
  coordinates?: [number, number]

  //   @Prop({ required: false, ref: () => Region })
  //   region?: Ref<Region>
  //
}

// export class Region extends Base {
//   @Prop({ required: true })
//   name!: string

//   @Prop({ ref: () => User, required: true })
//   owner!: Ref<User>

//   @Prop({ required: true, type: () => [Number] })
//   coordinates?: [number, number]
// }

export const UserModel = getModelForClass(User)
//export const RegionModel = getModelForClass(Region)
