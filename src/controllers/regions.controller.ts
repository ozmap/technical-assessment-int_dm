import { NextFunction, Request, Response } from 'express';
import regionsService from '../services/regions.service';
import { RegionRequestBody } from '../types/region.types';

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

const getRegionsBySpecificPoint = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lng, lat } = req.params;

    const regions = await regionsService.getRegionsBySpecificPoint(Number(lng), Number(lat));

    return res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

const getRegionsByDistance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lng, lat, distance, user } = req.query;

    if (user) {
      const regions = await regionsService.getRegionsByDistance(
        Number(lng),
        Number(lat),
        Number(distance),
        String(user),
      );

      return res.status(200).json(regions);
    }

    const regions = await regionsService.getRegionsByDistance(Number(lng), Number(lat), Number(distance));

    return res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

const createRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region: RegionRequestBody = req.body;

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
  getRegionsBySpecificPoint,
  getRegionsByDistance,
  createRegion,
  updateRegion,
  deleteRegion,
};
