import mongoose from 'mongoose'
import { RegionBodyTypes } from '../../controller/controller.regions'
import { RegionModel, UserModel } from '../../models/models'

const createService = async (body: RegionBodyTypes) => {
  let region
  try {
    region = await RegionModel.create(body)

    await UserModel.updateOne({ _id: body.owner }, { $push: { regions: region._id } })
  } catch (error) {
    if (region) {
      await RegionModel.findByIdAndDelete(region._id)
    }
    throw new Error(`Erro ao criar região: ${error.message}`)
  }
  return region
}

const findAllRegionsService = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit

    const regions = await RegionModel.find().skip(skip).limit(limit).lean()
    const total = await RegionModel.countDocuments()

    return { regions, total }
  } catch (error) {
    throw new Error(`Erro ao buscar todas as regiões: ${error.message}`)
  }
}

const findByIdRegionsService = async (id: string) => {
  try {
    const region = await RegionModel.findById(id).lean()

    return region
  } catch (error) {
    throw new Error(`Erro ao buscar região por ID: ${error.message}`)
  }
}

const updateRegionsService = async (
  id: string,
  nameRegion: string,
  owner: string,
  coordinatesRegion: [number, number],
) => {
  try {
    const region = await RegionModel.findOne({ _id: id }).lean()

    if (!region) {
      throw new Error('Região não encontrada')
    }

    const oldOwnerId = (region.owner as { _id?: string })?._id

    const updateFields = {
      ...(nameRegion && { nameRegion }),
      ...(owner && { owner }),
      ...(coordinatesRegion && { coordinatesRegion }),
    }

    const updatedRegion = await RegionModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true },
    )

    if (oldOwnerId && oldOwnerId !== owner) {
      await UserModel.findByIdAndUpdate(oldOwnerId, { $pull: { regions: id } })
    }

    await UserModel.findByIdAndUpdate(owner, { $addToSet: { regions: id } })

    return updatedRegion
  } catch (error) {
    throw new Error(`Erro no serviço de atualização: ${error.message}`)
  }
}

const deleteByIdRegionsService = async (regionId) => {
  try {
    const region = await RegionModel.findOne({ _id: regionId })

    if (!region) {
      throw new Error('Região não encontrada')
    }

    const ownerId = region.owner

    await RegionModel.deleteOne({ _id: regionId })

    if (ownerId) {
      await UserModel.findByIdAndUpdate(ownerId, { $pull: { regions: regionId } })
    }

    return { message: 'Região excluída' }
  } catch (error) {
    throw new Error(`Erro no serviço ao excluir região: ${error.message}`)
  }
}

const findByPointSpecificService = async (longitude: number, latitude: number) => {
  try {
    const regions = await RegionModel.find({
      coordinatesRegion: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 150,
        },
      },
    }).lean()

    return regions
  } catch (error) {
    throw new Error(`Erro no serviço de listar regiões por ponto específico : ${error.message}`)
  }
}

const findRegionsWithinDistanceService = async (
  userId: string,
  latitude: number,
  longitude: number,
  distanceInfo?: number,
  includeAllRegions?: boolean,
) => {
  try {
    if (includeAllRegions) {
      const regions = await RegionModel.find({
        coordinatesRegion: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $minDistance: 150,
            $maxDistance: distanceInfo,
          },
        },
      }).lean()

      return regions
    } else {
      const regions = await RegionModel.find({
        owner: new mongoose.Types.ObjectId(userId),
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

      return regions
    }
  } catch (error) {
    throw new Error(`Erro no serviço de listar regiões a uma certa distância de um ponto : ${error.message}`)
  }
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
