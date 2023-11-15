import { UserModel } from "../models/models";
import { CreateRequestBody } from "../user.controller/index";

const createService = (body: CreateRequestBody) => UserModel.create(body);

const findAllService = () => UserModel.find();

const findByIdService = (id: string) => UserModel.findById(id);

const updateService = (
  id: string,
  name: string,
  email: string,
  address: string,
  coordinates: [number, number]
) =>
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
  deleteByIdService,
};
