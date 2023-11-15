import { UserModel } from "../models/models";

const createService = (body) => UserModel.create(body);

const findAllService = () => UserModel.find();

const findByIdService = (id) => UserModel.findById(id);

const updateService = (id, name, email, adress, coordinates) =>
  UserModel.findOneAndUpdate(
    {
      _id: id,
    },
    { name, email, adress, coordinates }
  );

export default {
  createService,
  findAllService,
  findByIdService,
  updateService,
};
