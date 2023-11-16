import customError from '../errors/error';
import { UserModel } from '../db/models';
import { UserRequestBody } from '../types';

const findAll = async (page: number, limit: number) => {
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
      name: 'BAD_REQUEST',
      statusCode: 400,
      message: `O id ${id} é inválido`,
    });
  }

  return { message: 'Usuário obtido com sucesso', data: user };
};

const updateUserById = async (id: string, update: UserRequestBody) => {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw customError({
      name: 'BAD_REQUEST',
      statusCode: 400,
      message: `O id ${id} é inválido`,
    });
  }

  user.name = update.name;
  user.email = update.email;

  if (update.address) {
    user.address = update.address;
  }
  if (update.coordinates) {
    user.coordinates = update.coordinates;
  }

  await user.save();

  return { message: 'Usuario atualizado com sucesso' };
};

const createUser = async (user: UserRequestBody) => {
  const newUser = await UserModel.create(user);

  return { message: 'Usuário criado com sucesso', data: newUser };
};

export default {
  findAll,
  getUserById,
  updateUserById,
  createUser,
};
