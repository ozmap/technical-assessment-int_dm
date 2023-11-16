import { RegionModel } from '../models/models'

const createServiceRegions = (body) => RegionModel.create(body)

const findAllServiceRegions = () => RegionModel.find()

const findByIdServiceRegions = (id: string) => RegionModel.findById(id)

const updateServiceRegions = (
  id: string,
  name: string,
  email: string,
  address: string,
  coordinates: [number, number],
) =>
  RegionModel.findOneAndUpdate({ _id: id }, { name, email, address, coordinates }).catch((error) => {
    console.error('Erro no serviço de atualização:', error)
  })

const deleteByIdServiceRegions = (userId) => RegionModel.deleteOne(userId)

export default {
  createServiceRegions,
  findAllServiceRegions,
  findByIdServiceRegions,
  updateServiceRegions,
  deleteByIdServiceRegions,
}
