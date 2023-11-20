import { UserModel } from '../db/models';
import geoLibIntegration from './geoLib.integration';
import { NewUser, UserRequestBody } from '../types/user.types';
import formatAddress from '../utils/formatAddress';
import CustomError from '../errors/error';

const getAllUsers = async (page: number, limit: number) => {
  const [users, total] = await Promise.all([
    UserModel.find()
      .limit(limit)
      .skip((page - 1) * limit),
    UserModel.count(),
  ]);

  if (!users.length) {
    return { message: 'Não há nenhum usuário cadastrado neste intervalo', data: users, page, limit, total };
  }

  return { message: 'Usuários obtidos com sucesso', data: users, page, limit, total };
};

const getUserById = async (id: string) => {
  const user = await UserModel.findOne({ _id: id }).populate('regions');

  if (!user) {
    throw new CustomError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhum usuário foi encontrado com o id ${id}`,
    });
  }

  return { message: 'Usuário obtido com sucesso', data: user };
};

const updateUserById = async (id: string, update: UserRequestBody) => {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw new CustomError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhum usuário foi encontrado com o id ${id}`,
    });
  }

  const newUser: NewUser = { name: update.name, email: update.email };

  if (update.address) {
    const { lat, lng } = await geoLibIntegration.getCoordinatesFromAddress(update.address.zipCode);
    const formatedAddress = formatAddress(update.address);

    newUser.coordinates = [lng, lat];
    newUser.address = formatedAddress;
  }

  if (update.coordinates) {
    const address = await geoLibIntegration.getAddressFromCoordinates(update.coordinates);

    newUser.address = address;
    newUser.coordinates = [update.coordinates.lng, update.coordinates.lat];
  }

  await UserModel.updateOne({ _id: id }, newUser);

  return { message: 'Usuário atualizado com sucesso' };
};

const createUser = async (user: UserRequestBody) => {
  const verifyNewUser = await UserModel.findOne({ email: user.email });

  if (verifyNewUser) {
    throw new CustomError({
      name: 'UNPROCESSABLE_ENTITY',
      statusCode: 422,
      message: 'Email já está cadastrado',
    });
  }

  const newUser: NewUser = {
    name: user.name,
    email: user.email,
  };

  if (user.address) {
    const { lat, lng } = await geoLibIntegration.getCoordinatesFromAddress(user.address.zipCode);
    const formatedAddress = formatAddress(user.address);

    newUser.coordinates = [lng, lat];
    newUser.address = formatedAddress;
  }

  if (user.coordinates) {
    const address = await geoLibIntegration.getAddressFromCoordinates(user.coordinates);

    newUser.address = address;
    newUser.coordinates = [user.coordinates.lng, user.coordinates.lat];
  }

  const result = await UserModel.create(newUser);

  return { message: 'Usuário criado com sucesso', data: result };
};

const deleteUser = async (id: string) => {
  const user = await UserModel.findByIdAndDelete({ _id: id });

  if (!user) {
    throw new CustomError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhum usuário foi encontrado com o id ${id}`,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserById,
  createUser,
  deleteUser,
};
