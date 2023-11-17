import { RegionModel, UserModel } from '../db/models';
import customError from '../errors/error';
import { RegionRequestBody } from '../types/region.types';

const getAllRegions = async (page: number, limit: number) => {
  const [regions, total] = await Promise.all([
    RegionModel.find()
      .limit(limit)
      .skip((page - 1) * limit),
    RegionModel.count(),
  ]);

  if (!regions.length) {
    return { message: 'Não há nenhuma região cadastrada neste intervalo', data: regions, page, limit, total };
  }

  return { message: 'Regiões obtidas com sucesso', data: regions, page, limit, total };
};

const getRegionById = async (id: string) => {
  const region = await RegionModel.findOne({ _id: id }).populate('user');

  if (!region) {
    throw customError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhuma região foi encontrada com o id ${id}`,
    });
  }

  return { message: 'Região obtida com sucesso', data: region };
};

const createRegion = async (region: RegionRequestBody) => {
  const verifyRegion = await RegionModel.findOne({ coordinates: region.coordinates });

  console.log(verifyRegion);

  if (verifyRegion) {
    throw customError({
      name: 'UNPROCESSABLE_ENTITY',
      statusCode: 422,
      message: 'Essa região já está cadastrada',
    });
  }

  const newRegion = await RegionModel.create(region);

  return { message: 'Região criada com sucesso', data: newRegion };
};

const updateRegion = async (region: RegionRequestBody, id: string) => {
  const verifyRegion = await RegionModel.findOne({ _id: id });

  if (!verifyRegion) {
    throw customError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhuma região foi encontrada com o id ${id}`,
    });
  }

  const userRegion = await UserModel.findOne({ regions: id });

  if (userRegion._id !== region.user) {
    await UserModel.updateOne({ _id: userRegion._id }, { $pull: { regions: id } });
    await UserModel.updateOne({ _id: region.user }, { $push: { regions: id } });
  }

  await RegionModel.updateOne({ _id: id }, region);

  return { message: 'Região atualizada com sucesso' };
};

const deleteRegion = async (id: string) => {
  const verifyRegion = await RegionModel.findOne({ _id: id });

  if (!verifyRegion) {
    throw customError({
      name: 'NOT_FOUND',
      statusCode: 404,
      message: `Nenhuma região foi encontrada com o id ${id}`,
    });
  }

  await UserModel.updateOne({ _id: verifyRegion.user }, { $pull: { regions: id } });
  await RegionModel.deleteOne({ _id: id });
};

export default {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
};
