import customError from '../errors/error';
import { UserModel } from '../db/models';
import geoLibIntegration from './geoLib.integration';
import { NewUser, UserRequestBody } from '../types/user.types';
import formatAddress from '../utils/formatAddress';

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
  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    throw customError({
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
    throw customError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhum usuário foi encontrado com o id ${id}`,
    });
  }

  if (user.email === update.email) {
    throw customError({
      name: 'UNPROCESSABLE_ENTITY',
      statusCode: 422,
      message: 'Email já está cadastrado',
    });
  }

  const newUser: NewUser = {
    name: update.name,
    email: update.email,
  };

  if (update.address) {
    const formatedAddress = formatAddress(update.address);
    const { lat, lng } = await geoLibIntegration.getCoordinatesFromAddress(formatedAddress);
    const address = await geoLibIntegration.getAddressFromCoordinates([lat, lng]);

    newUser.coordinates = [lat, lng];
    newUser.address = address;
  }

  if (update.coordinates) {
    const address = await geoLibIntegration.getAddressFromCoordinates([...update.coordinates]);

    newUser.address = address;
    newUser.coordinates = update.coordinates;
  }

  await UserModel.updateOne({ _id: id }, newUser);

  return { message: 'Usuário atualizado com sucesso' };
};

const createUser = async (user: UserRequestBody) => {
  const verifyNewUser = await UserModel.findOne({ email: user.email });

  if (verifyNewUser) {
    throw customError({
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
    const formatedAddress = formatAddress(user.address);
    const { lat, lng } = await geoLibIntegration.getCoordinatesFromAddress(formatedAddress);
    const address = await geoLibIntegration.getAddressFromCoordinates([lat, lng]);

    newUser.coordinates = [lat, lng];
    newUser.address = address;
  }

  if (user.coordinates) {
    const address = await geoLibIntegration.getAddressFromCoordinates([...user.coordinates]);

    newUser.address = address;
    newUser.coordinates = user.coordinates;
  }

  const result = await UserModel.create(newUser);

  return { message: 'Usuário criado com sucesso', data: result };
};

const deleteUser = async (id: string) => {
  const user = await UserModel.findByIdAndDelete({ _id: id });

  if (!user) {
    throw customError({
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
