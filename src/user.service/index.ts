import { UserModel } from "../models/models";

const createService = (body) => UserModel.create(body);

const findAllService = () => UserModel.find();

const findByIdService = (id) => UserModel.findById(id);

const updateService = (id, name, email, address, coordinates) =>
  UserModel.findOneAndUpdate(
    { _id: id },
    { name, email, address, coordinates }
  ).catch((error) => {
    console.error("Erro no serviço de atualização:", error);
  });

const deleteByIdService = (userId) => UserModel.deleteOne(userId);

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
};
