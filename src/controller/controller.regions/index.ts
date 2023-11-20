import { STATUS } from '../controller.user/index'
import { RegionModel, UserModel } from '../../models/models'
import regionService from '../../service/service.regions'

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

    const region = await regionService.createService({
      nameRegion,
      owner,
      coordinatesRegion: [coordinatesRegion[0], coordinatesRegion[1]],
    })

    if (!region) {
      return res.status(STATUS.NOT_FOUND).send({ message: 'Erro ao criar Região' })
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
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no Servidor ao criar Usuário / Região : ' + error.message })
  }
}

const findAllRegions = async (req, res) => {
  try {
    const { page, limit } = req.query

    const { regions, total } = await regionService.findAllRegionsService()

    return res
      .json({
        rows: regions,
        page,
        limit,
        total,
      })
      .status(STATUS.OK)
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no servidor ao pesquisar todas regiões: ' + error.message })
  }
}

const findByIdRegions = async (req, res) => {
  try {
    const { id } = req.params

    const region = await regionService.findByIdRegionsService(id)

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Região não encontrada' })
    }

    return res.status(STATUS.OK).json({ region })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no servidor ao realizar pesquisa por ID: ' + error.message })
  }
}

const updateRegions = async (req, res) => {
  try {
    const { id } = req.params
    const { nameRegion, owner, coordinatesRegion }: RegionBodyTypes = req.body

    const updatedRegion = await regionService.updateRegionsService(id, nameRegion, owner, coordinatesRegion)

    return res.status(STATUS.UPDATED).json({ message: 'Atualização feita com sucesso' })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro de servidor para atualizar dado(s) da região: ' + error.message })
  }
}

const deleteByIdRegions = async (req, res) => {
  try {
    const { id } = req.params

    await regionService.deleteByIdRegionsService(id)

    return res.status(STATUS.OK).json({ message: 'Região excluída com sucesso' })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro de servidor ao deletar região: ' + error.message })
  }
}

const findRegionsByPointSpecific = async (req, res) => {
  try {
    const latitude: number = parseFloat(req.query.latitude)
    const longitude: number = parseFloat(req.query.longitude)

    if (!latitude || !longitude) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Informe corretamente as coordenadas (latitude e longitude) para listar as regiões.',
      })
    }
    const regions = await regionService.findByPointSpecificService(latitude, longitude)

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
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro de servidor ao listar regiões por ponto específico: ' + error.message })
  }
}

const findRegionsWithinDistance = async (req, res) => {
  try {
    const userId = String(req.query.userId)
    const latitude: number = parseFloat(req.query.latitude)
    const longitude: number = parseFloat(req.query.longitude)
    const distanceInfo: number = parseInt(req.query.distance) || 1000
    const includeAllRegions: boolean = req.query.includeAllRegions === 'true'

    if (!latitude || !longitude || distanceInfo < 0) {
      return res.status(STATUS.BAD_REQUEST).send({
        message:
          'Informe corretamente as coordenadas (latitude e longitude) e uma distância não pode ser negativa para listar as regiões.',
      })
    }

    const regions = await regionService.findRegionsWithinDistanceService(
      userId,
      longitude,
      latitude,
      distanceInfo,
      includeAllRegions,
    )

    if (regions.length > 0) {
      return res.status(STATUS.OK).send({
        message: 'Regiões encontradas com sucesso!',
        regions,
      })
    } else {
      return res.status(STATUS.NOT_FOUND).send({
        message: 'Nenhuma região encontrada dentro da distância especificada.',
      })
    }
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
      message: 'Erro de servidor ao listar regiões por distância informada do ponto específico:' + error.message,
    })
  }
}

export default {
  createRegions,
  findAllRegions,
  findByIdRegions,
  updateRegions,
  deleteByIdRegions,
  findRegionsByPointSpecific,
  findRegionsWithinDistance,
}
