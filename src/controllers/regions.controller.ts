import { NextFunction, Request, Response } from 'express';
import regionsService from '../services/regions.service';
import { RegionRequestBody } from '../types/region.types';
import { UserModel } from '../db/models';
import customError from '../errors/error';

const getAllRegions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const regions = await regionsService.getAllRegions(Number(page), Number(limit));

    return res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

const getRegionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const region = await regionsService.getRegionById(id);

    return res.status(200).json(region);
  } catch (error) {
    next(error);
  }
};

const createRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region: RegionRequestBody = req.body;

    const verifyUser = await UserModel.findById(region.user);

    if (!verifyUser) {
      throw customError({
        name: 'NOT_FOUND',
        statusCode: 404,
        message: `Nenhum usuário foi encontrado com o id ${region.user}`,
      });
    }

    const newRegion = await regionsService.createRegion(region);

    return res.status(201).json(newRegion);
  } catch (error) {
    next(error);
  }
};

const updateRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region: RegionRequestBody = req.body;
    const { id } = req.params;

    const updatedRegion = await regionsService.updateRegion(region, id);

    return res.status(201).json(updatedRegion);
  } catch (error) {
    next(error);
  }
};

const deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await regionsService.deleteRegion(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
};
