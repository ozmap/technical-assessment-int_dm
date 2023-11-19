import { STATUS } from '../controller.user/index'
import { RegionModel, UserModel } from '../models/models'
import regionService from '../service.regions/index'

export interface RegionBodyTypes {
  nameRegion: string
  coordinatesRegion: [number, number]
  owner: string
}

const createRegions = async (req, res) => {
  try {
    const { nameRegion, coordinatesRegion, owner }: RegionBodyTypes = req.body

    if (!nameRegion || !coordinatesRegion || !owner) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Preencha  todos os campos corretamente para registrar a Região',
      })
    }

    const existingRegion = await RegionModel.findOne({ coordinatesRegion }).lean()
    if (existingRegion) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Região já cadastrada',
      })
    }

    const region = await regionService.createService({
      nameRegion,
      owner,
      coordinatesRegion: [coordinatesRegion[1], coordinatesRegion[0]],
    })

    if (!region) {
      return res.status(STATUS.NOT_FOUND).send({ message: 'Erro ao criar Região' })
    }

    const regionId = region._id
    const user = await UserModel.findById(owner)

    if (user) {
      user.regions.push(regionId)
      await user.save()
    }

    return res.status(STATUS.CREATED).send({
      menssage: 'Região criada com sucesso!',
      user: {
        id: region._id,
        nameRegion,
        owner,
        coordinatesRegion,
      },
    })
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const findAllRegions = async (req, res) => {
  try {
    const { page, limit } = req.query

    const [Regions, total] = await Promise.all([RegionModel.find().lean(), RegionModel.count()])

    return res
      .json({
        rows: Regions,
        page,
        limit,
        total,
      })
      .status(STATUS.OK)
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const findByIdRegions = async (req, res) => {
  try {
    const { id } = req.params

    const region = await RegionModel.findOne({ _id: id }).lean()

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Região não encontrada' })
    }

    return res.status(STATUS.OK).json({ region })
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const updateRegions = async (req, res) => {
  try {
    const { id } = req.params
    const { nameRegion, owner, coordinatesRegion }: RegionBodyTypes = req.body

    const region = await RegionModel.findOne({ _id: id }).lean()

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Região não encontrada' })
      return
    }

    const oldOwnerId = (region.owner as { _id?: string })?._id

    const updatedRegion = await regionService.updateRegions(id, nameRegion, owner, coordinatesRegion)

    if (oldOwnerId && oldOwnerId !== owner) {
      await UserModel.findByIdAndUpdate(oldOwnerId, { $pull: { regions: id } })
    }

    await UserModel.findByIdAndUpdate(owner, { $addToSet: { regions: id } })

    return res.status(STATUS.UPDATED).json({ message: 'Atualização feita com sucesso' })
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const deleteByIdRegions = async (req, res) => {
  try {
    const { id } = req.params

    const region = await RegionModel.findOne({ _id: id })

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Região não encontrada' })
    }

    await RegionModel.deleteOne({ _id: id })

    return res.status(STATUS.OK).json({ message: 'Região excluída com sucesso' })
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const findRegionsByPoint = async (req, res) => {
  try {
    const { latitude, longitude } = req.query

    if (!latitude || !longitude) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Informe corretamente as coordenadas (latitude e longitude) para listar as regiões.',
      })
    }
    const regions = await regionService.findByPoint(parseFloat(latitude), parseFloat(longitude))

    if (regions.length > 0) {
      return res.status(STATUS.OK).send({
        message: 'Regiões encontradas com sucesso!',
        regions,
      })
    } else {
      return res.status(STATUS.NOT_FOUND).send({
        message: 'Nenhuma região encontrada!',
      })
    }
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

export default {
  createRegions,
  findAllRegions,
  findByIdRegions,
  updateRegions,
  deleteByIdRegions,
  findRegionsByPoint,
}
