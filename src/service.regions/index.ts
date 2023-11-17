import { RegionBodyTypes } from '../controller.regions'
import { RegionModel } from '../models/models'

const createService = (body: RegionBodyTypes) => RegionModel.create(body)

const findAllRegions = () => RegionModel.find()

const findByIdRegions = (id: string) => RegionModel.findById(id)

const updateRegions = (id: string, nameRegion: string, owner: string, coordinatesRegion: [number, number]) =>
  RegionModel.findOneAndUpdate({ _id: id }, { nameRegion, owner, coordinatesRegion }).catch((error) => {
    console.error('Erro no serviço de atualização:', error)
  })

const deleteByIdRegions = (regionId) => RegionModel.deleteOne(regionId)

export default {
  createService,
  findAllRegions,
  findByIdRegions,
  updateRegions,
  deleteByIdRegions,
}
