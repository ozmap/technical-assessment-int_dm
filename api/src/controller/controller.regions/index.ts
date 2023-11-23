import { STATUS } from '../controller.user/index'
import regionService from '../../service/service.regions'

export interface RegionBodyTypes {
  nameRegion: string
  coordinatesRegion: [number, number]
  owner: string
}

const createRegions = async (req, res) => {
  try {
    const { nameRegion, coordinatesRegion, owner }: RegionBodyTypes = req.body

    console.log('nameRegion: ', nameRegion, ' coordinatesRegion: ', coordinatesRegion, ' owner: ', owner)

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
    console.log(region)

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
    const { regions, total } = await regionService.findAllRegionsService(req.query.page, req.query.limit)

    console.log(regions)

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

    console.log('Id da região para pesquisar:', id)

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Região não encontrada' })
    }

    console.log(region)

    return res.status(STATUS.OK).json({ region })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no servidor ao realizar pesquisa de região por ID: ' + error.message })
  }
}

const updateRegions = async (req, res) => {
  try {
    const { id } = req.params
    const { nameRegion, owner, coordinatesRegion }: RegionBodyTypes = req.body

    console.log('Id Region: ', id)
    console.log('nameRegion: ', nameRegion, ' owner: ', owner, 'coordinatesRegion: ', coordinatesRegion)

    if (nameRegion == '' && owner == '' && Object.is(coordinatesRegion, [])) {
      return res.status(STATUS.BAD_REQUEST).json({ message: 'Nenhum dado informado para atualização da região' })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedRegion = await regionService.updateRegionsService(id, nameRegion, owner, coordinatesRegion)

    return res.status(STATUS.UPDATED).json({ message: 'Atualização da região feita com sucesso' })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro de servidor para atualizar dado(s) da região: ' + error.message })
  }
}

const deleteByIdRegions = async (req, res) => {
  try {
    const { id } = req.params

    console.log('Id da região para exclusão: ', id)

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
    const page: number = req.query.page ? parseInt(req.query.page) : 1
    const limit: number = req.query.limit ? parseInt(req.query.limit) : 10

    console.log('Pesquisar : latitude: ', latitude, 'longitude :', longitude)

    if (!latitude || !longitude) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Informe corretamente as coordenadas (latitude e longitude) para listar as regiões.',
      })
    }
    const { regions, total } = await regionService.findByPointSpecificService(latitude, longitude, page, limit)

    if (regions.length > 0) {
      return res.status(STATUS.OK).send({
        message: 'Regiões encontradas com sucesso!',
        regions,
        page,
        total,
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

    console.log('Pesquisar : latitude: ', latitude, 'longitude :', longitude, 'distanceInfo: ', distanceInfo)

    if (!latitude || !longitude || distanceInfo < 0) {
      return res.status(STATUS.BAD_REQUEST).send({
        message:
          'Informe corretamente as coordenadas (latitude e longitude) e uma distância não pode ser negativa para listar as regiões.',
      })
    }

    const { regions, total } = await regionService.findRegionsWithinDistanceService(
      userId,
      longitude,
      latitude,
      distanceInfo,
      includeAllRegions,
      req.query.page,
      req.query.limit,
    )

    console.log(regions)

    if (regions.length > 0) {
      return res.status(STATUS.OK).send({
        message: 'Regiões encontradas com sucesso!',
        regions,
        page: req.query.page,
        limit: req.query.limit,
        total,
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
