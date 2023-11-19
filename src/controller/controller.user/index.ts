import { UserModel } from '../../models/models'
import userService from '../../service/service.user'
import regionService from '../../service/service.regions'

export const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 400,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  DEFAULT_ERROR: 418,
}

export interface UserBodyTypes {
  nameUser: string
  email: string
  addressUser?: string
  coordinatesUser?: [number, number]
  region?: {
    nameRegion: string
    coordinatesRegion: [number, number]
    owner?: string
  }
}

const create = async (req, res) => {
  try {
    const { nameUser, email, addressUser, coordinatesUser, region }: UserBodyTypes = req.body

    if (!nameUser || !email) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Preencha os campos Nome e E-mail corretamente para efetuar o cadastro',
      })
    }

    const existingUser = await UserModel.findOne({ email }).lean()

    if (existingUser) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Usuário com esse e-mail já cadastrado',
      })
    }

    const user = await userService.createService({
      nameUser,
      email,
      addressUser,
      coordinatesUser,
    })

    if (!user) {
      return res.status(STATUS.NOT_FOUND).send({ message: 'Erro ao criar usuário' })
    }

    if (region) {
      const regionData = {
        nameRegion: region.nameRegion,
        owner: user._id,
        coordinatesRegion: region.coordinatesRegion,
      }

      const createdRegion = await regionService.createService(regionData)

      if (!createdRegion) {
        return res.status(STATUS.NOT_FOUND).send({ message: 'Erro ao criar região' })
      }

      user.regions = [createdRegion._id]
      await user.save()

      return res.status(STATUS.CREATED).send({
        message: 'Usuário e região criados com sucesso!',
        user: {
          id: user._id,
          nameUser,
          email,
          addressUser,
          coordinatesUser,
          regions: [createdRegion._id],
        },
      })
    }

    return res.status(STATUS.CREATED).send({
      message: 'Usuário criado com sucesso!',
      user: {
        id: user._id,
        nameUser,
        email,
        addressUser,
        coordinatesUser,
      },
    })
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const findAll = async (req, res) => {
  try {
    const { page, limit } = req.query

    const [users, total] = await Promise.all([UserModel.find().lean(), UserModel.count()])

    return res
      .json({
        rows: users,
        page,
        limit,
        total,
      })
      .status(STATUS.OK)
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const findById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findOne({ _id: id }).lean()

    if (!user) {
      res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
    }

    return res.status(STATUS.OK).json({ user })
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { nameUser, email, addressUser, coordinatesUser }: UserBodyTypes = req.body

    const user = await UserModel.findOne({ _id: id }).lean()

    if (!user) {
      res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
      return
    }

    await userService.updateService(id, nameUser, email, addressUser, coordinatesUser)

    return res.status(STATUS.UPDATED).json({ message: 'Atualização feita com sucesso' })
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

const deleteById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findOne({ _id: id })

    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
    }

    if (user.regions && user.regions.length > 0) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: 'Usuário ainda é proprietário de região(ões), por esse motivo não pode ser excluído.',
      })
    }

    await UserModel.deleteOne({ _id: id })

    return res.status(STATUS.OK).json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

export default {
  create,
  findAll,
  findById,
  update,
  deleteById,
}
