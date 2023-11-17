import { UserModel } from '../models/models'
import userService from '../service.user'

export const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 400,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  DEFAULT_ERROR: 418,
}

export interface CreateRequestBody {
  name: string
  email: string
  address?: string
  coordinates?: [number, number]
  //regions?: string | [number, number]
}

const create = async (req, res) => {
  try {
    const { name, email, address, coordinates }: CreateRequestBody = req.body

    if (!name || !email) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Preencha os campos : Nome e E-mail corretamente, para efetuar o cadastro',
      })
    }

    const existingUser = await UserModel.findOne({ email }).lean()
    if (existingUser) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Usuário com e-mail já cadastrado',
      })
    }

    const user = await userService.createService({
      name,
      email,
      address,
      coordinates,
    })

    if (!user) {
      return res.status(STATUS.NOT_FOUND).send({ message: 'Erro ao criar usuário' })
    }

    return res.status(STATUS.CREATED).send({
      menssage: 'Usuário criado com sucesso!',
      user: {
        id: user._id,
        name,
        email,
        address,
        coordinates: user.coordinates,
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
    const { name, email, address, coordinates }: CreateRequestBody = req.body

    const user = await UserModel.findOne({ _id: id }).lean()

    if (!user) {
      res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
      return
    }

    await userService.updateService(id, name, email, address, coordinates)

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
