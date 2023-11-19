import 'reflect-metadata'

import * as mongoose from 'mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Prop, getModelForClass, Ref, index } from '@typegoose/typegoose'

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new mongoose.Types.ObjectId().toString() })
  _id: string
}

export class User extends Base {
  @Prop({ required: true })
  nameUser!: string

  @Prop({ required: true, unique: true })
  email!: string

  @Prop({ required: false })
  addressUser?: string

  @Prop({ required: false, type: () => [Number] })
  coordinatesUser?: [number, number]

  @Prop({ required: false, default: [] as Ref<Region>[] })
  regions?: Ref<Region>[]
}

@index({ coordinatesRegion: '2dsphere' })
export class Region extends Base {
  @Prop({ required: true })
  nameRegion!: string

  @Prop({ ref: () => User, required: true })
  owner!: Ref<User>

  @Prop({ required: true, type: () => [Number] })
  coordinatesRegion!: [number, number]
}

export const UserModel = getModelForClass(User)
export const RegionModel = getModelForClass(Region)
