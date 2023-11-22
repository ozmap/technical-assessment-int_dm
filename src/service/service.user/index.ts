import { RegionModel, UserModel } from '../../models/models'
import { UserBodyTypes } from '../../controller/controller.user'

const createService = async (body: UserBodyTypes) => {
  try {
    const email = body.email
    const existingUser = await UserModel.findOne({ email }).lean()

    if (existingUser) {
      return { message: 'Usuário com esse e-mail já cadastrado' }
    }

    const user = await UserModel.create(body)

    if (body.region) {
      const regionData = {
        nameRegion: body.region.nameRegion,
        owner: user._id,
        coordinatesRegion: body.region.coordinatesRegion,
      }

      const createdRegion = await RegionModel.create(regionData)

      user.regions = [createdRegion._id]
      await user.save()
    }
    return user
  } catch (error) {
    throw new Error(`Erro ao criar Usuário: ${error.message}`)
  }
}

const findAllService = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit

    const users = await UserModel.find().skip(skip).limit(limit).lean()
    const total = await UserModel.countDocuments()

    return { users, total }
  } catch (error) {
    throw new Error(`Erro ao buscar todos os usuários: ${error.message}`)
  }
}

const findByIdService = async (id: string) => {
  try {
    const user = await UserModel.findById(id).lean()
    return user
  } catch (error) {
    throw new Error(`Erro ao buscar usuário por ID: ${error.message}`)
  }
}

const updateService = async (
  id: string,
  nameUser?: string,
  email?: string,
  addressUser?: string,
  coordinatesUser?: [number, number],
) => {
  try {
    const updateFields = {
      ...(nameUser && { nameUser }),
      ...(email && { email }),
      ...(addressUser && { addressUser }),
      ...(coordinatesUser && { coordinatesUser }),
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true },
    )

    console.log('UpdatedUser: ', updatedUser)

    return updatedUser
  } catch (error) {
    console.error('Erro no serviço de atualização do usuário:', error)
    throw new Error(`Erro ao atualizar usuário: ${error.message}`)
  }
}

const deleteByIdService = async (userId: string) => {
  try {
    const user = await UserModel.findOne({ _id: userId })

    if (!user) {
      throw new Error('Usuário não encontrado para exclusão')
    }

    if (user.regions && user.regions.length > 0) {
      throw new Error('Usuário ainda é proprietário de região(ões), por esse motivo não pode ser excluído.')
    }

    await UserModel.deleteOne({ _id: userId })

    return { message: 'Usuário excluído' }
  } catch (error) {
    console.error('Erro no serviço de exclusão do usuário:', error)
    throw new Error(`Erro ao excluir usuário: ${error.message}`)
  }
}

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
  deleteByIdService,
}
