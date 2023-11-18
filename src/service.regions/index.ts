import { RegionBodyTypes } from '../controller.regions'
import { RegionModel } from '../models/models'

const createService = (body: RegionBodyTypes) => RegionModel.create(body)

const findAllRegions = () => RegionModel.find()

const findByIdRegions = (id: string) => RegionModel.findById(id)

const updateRegions = (id: string, nameRegion: string, owner: string, coordinatesRegion: [number, number]) =>
  RegionModel.findOneAndUpdate({ _id: id }, { nameRegion, owner, coordinatesRegion }).catch((error) => {
    throw new Error(`Erro no serviço de atualização: ${error.message}`)
  })

const deleteByIdRegions = (regionId) => RegionModel.deleteOne(regionId)

const findByPoint = async (latitude: number, longitude: number) => {
  console.log('chegou no service - rota')
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

export default {
  createService,
  findAllRegions,
  findByIdRegions,
  updateRegions,
  deleteByIdRegions,
  findByPoint,
}
