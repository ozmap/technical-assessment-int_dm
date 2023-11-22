import { Region, RegionModel, User, UserModel } from '../db/models';
import CustomError from '../errors/error';
import exportToCsv from '../utils/exportToCsv';

const exportUsers = async () => {
  const users = await UserModel.find();

  if (!users.length) {
    throw new CustomError({
      name: 'ExportError',
      message: 'Não foi possível exportar pois não há usuários cadastrados',
      statusCode: 404,
    });
  }

  const fields = ['_id', 'name', 'email', 'address', 'coordinates', 'createdAt', 'updatedAt'];

  await exportToCsv<User[]>(users, 'users', fields);

  return { message: 'Usuários exportados com sucesso' };
};

const exportRegions = async () => {
  const regions = await RegionModel.find();

  if (!regions.length) {
    throw new CustomError({
      name: 'ExportError',
      message: 'Não foi possível exportar pois não há regiões cadastradas',
      statusCode: 404,
    });
  }

  const fields = ['_id', 'name', 'coordinates', 'user', 'createdAt', 'updatedAt'];

  await exportToCsv<Region[]>(regions, 'regions', fields);

  return { message: 'Regiões exportadas com sucesso' };
};

export default {
  exportUsers,
  exportRegions,
};
