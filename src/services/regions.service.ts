import { RegionModel } from '../db/models';
import { RegionRequestBody } from '../types/region.types';

const getAllRegions = async (page: number, limit: number) => {
  const [regions, total] = await Promise.all([
    RegionModel.find()
      .limit(limit)
      .skip((page - 1) * limit),
    RegionModel.count(),
  ]);

  if (!regions.length) {
    return { message: 'Não há nenhum usuário cadastrado neste intervalo', data: regions, page, limit, total };
  }

  return { message: 'Regiões obtidas com sucesso', data: regions, page, limit, total };
};

const createRegion = async (region: RegionRequestBody) => {};

export default {
  getAllRegions,
};
