import userService from '../../service/service.user'

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

    if (!nameUser || !email || !addressUser || !coordinatesUser) {
      return res.status(STATUS.BAD_REQUEST).send({
        message: 'Preencha todos os campos obrigatórios para efetuar o cadastro',
      })
    }

    const user = await userService.createService({
      nameUser,
      email,
      addressUser,
      coordinatesUser,
      region,
    })

    if (user) {
      const responseData = {
        message: region ? 'Usuário e região criados com sucesso!' : 'Usuário criado com sucesso!',
        user: {
          id: user._id,
          nameUser,
          email,
          addressUser,
          coordinatesUser,
          regions: user.regions || [],
        },
      }
      return res.status(STATUS.CREATED).send(responseData)
    }
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no Servidor ao criar Usuário: ' + error.message })
  }
}

const findAll = async (req, res) => {
  try {
    const { page, limit } = req.query

    const { users, total } = await userService.findAllService()

    return res
      .json({
        rows: users,
        page,
        limit,
        total,
      })
      .status(STATUS.OK)
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no servidor ao pesquisar todos usuários : ' + error.message })
  }
}

const findById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await userService.findByIdService(id)

    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
    }

    return res.status(STATUS.OK).json({ user })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro no servidor ao realizar pesquisa de usuário por ID: ' + error.message })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { nameUser, email, addressUser, coordinatesUser }: UserBodyTypes = req.body

    const updated = await userService.updateService(id, nameUser, email, addressUser, coordinatesUser)

    if (!updated) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
    }

    return res.status(STATUS.UPDATED).json({ message: 'Atualização do usuário feito com sucesso' })
  } catch (error) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'Erro de servidor para atualizar dado(s) do usuário: ' + error.message })
  }
}

const deleteById = async (req, res) => {
  try {
    const { id } = req.params

    const deleted = await userService.deleteByIdService(id)

    if (!deleted) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Usuário não encontrado' })
    }

    return res.status(STATUS.OK).json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
  }
}

export default {
  create,
  findAll,
  findById,
  update,
  deleteById,
}