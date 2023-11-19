import { RegionBodyTypes } from '../../controller/controller.regions'
import { RegionModel } from '../../models/models'

const createService = (body: RegionBodyTypes) => RegionModel.create(body)

const findAllRegionsService = () => RegionModel.find()

const findByIdRegionsService = (id: string) => RegionModel.findById(id)

const updateRegionsService = (id: string, nameRegion: string, owner: string, coordinatesRegion: [number, number]) =>
  RegionModel.findOneAndUpdate({ _id: id }, { nameRegion, owner, coordinatesRegion }).catch((error) => {
    throw new Error(`Erro no serviço de atualização: ${error.message}`)
  })

const deleteByIdRegionsService = (regionId) => RegionModel.deleteOne(regionId)

const findByPointSpecificService = async (latitude: number, longitude: number) => {
  const regions = await RegionModel.find({
    coordinatesRegion: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
    },
  }).lean()

  return regions
}

const findRegionsWithinDistanceService = async (
  userId: string,
  latitude: number,
  longitude: number,
  distanceInfo?: number,
) => {
  const regions = await RegionModel.find({
    owner: userId,
    coordinatesRegion: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: distanceInfo,
      },
    },
  }).lean()

  console.log('Regiões encontradas:', regions)
  return regions
}

export default {
  createService,
  findAllRegionsService,
  findByIdRegionsService,
  updateRegionsService,
  deleteByIdRegionsService,
  findByPointSpecificService,
  findRegionsWithinDistanceService,
}
