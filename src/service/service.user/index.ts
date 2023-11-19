import { UserModel } from '../../models/models'
import { UserBodyTypes } from '../../controller/controller.user'

const createService = (body: UserBodyTypes) => UserModel.create(body)

const findAllService = () => UserModel.find()

const findByIdService = (id: string) => UserModel.findById(id)

const updateService = (
  id: string,
  nameUser: string,
  email: string,
  addressUser: string,
  coordinatesUser: [number, number],
) =>
  UserModel.findOneAndUpdate({ _id: id }, { nameUser, email, addressUser, coordinatesUser }).catch((error) => {
    console.error('Erro no serviço de atualização:', error)
  })

const deleteByIdService = (userId) => UserModel.deleteOne(userId)

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
  deleteByIdService,
}
