import "reflect-metadata";

import * as mongoose from "mongoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
} from "@typegoose/typegoose";
import lib from "../lib";

import ObjectId = mongoose.Types.ObjectId;

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

// @pre<User>("save", async function (next) {
//   const region = this as Omit<any, keyof User> & User;

//   if (region.isModified("coordinates")) {
//     region.address = await lib.getAddressFromCoordinates(region.coordinates);
//   } else if (region.isModified("address")) {
//     const { lat, lng } = await lib.getCoordinatesFromAddress(region.address);
//     region.coordinates = [lng, lat];
//   }

//   next();
// })

export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false, type: () => [Number] })
  coordinates: [number, number];

  //   @Prop({ required: false, default: [], ref: () => Region, type: () => String })
  //   regions: Ref<Region>[];
  //
}

//  @pre<Region>("save", async function (next) {
//    const region = this as Omit<any, keyof Region> & Region;

//   if (!region._id) {
//     region._id = new ObjectId().toString();
//   }
//   if (region.isNew) {
//     const user = await UserModel.findOne({ _id: region.user });
//     user.regions.push(region._id);
//     await user.save({ session: region.$session() });
//   }

//   next(region.validateSync());
// })
// @modelOptions({ schemaOptions: { validateBeforeSave: false } })
// export class Region extends Base {
//   @Prop({ required: true, auto: true })
//   _id: string;

//   @Prop({ required: true })
//   name!: string;

//   @Prop({ ref: () => User, required: true, type: () => String })
//   user: Ref<User>;
// }

// export const RegionModel = getModelForClass(Region);
export const UserModel = getModelForClass(User);
