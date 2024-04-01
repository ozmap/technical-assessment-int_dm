import { RegionModel } from '../models/model'

export async function getAllRegions() {
  return await RegionModel.find()
}

export async function getRegionById(id: string) {
  return await RegionModel.findById(id)
}

export async function createRegion(
  name: string,
  coordinates: [[number, number]],
  userId: string
) {
  return await RegionModel.create({ name, coordinates, user: userId })
}

export async function updateRegion(
  id: string,
  name: string,
  coordinates: [[number, number]]
) {
  return await RegionModel.findByIdAndUpdate(
    id,
    { name, coordinates },
    { new: true }
  )
}

export async function deleteRegion(id: string) {
  return await RegionModel.findByIdAndDelete(id)
}

export async function getRegionsContainingPoint(
  longitude: number,
  latitude: number
) {
  return await RegionModel.find({
    coordinates: {
      $elemMatch: {
        $eq: [longitude, latitude]
      }
    }
  }).lean()
}
