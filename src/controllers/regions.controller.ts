import { NextFunction, Request, Response } from 'express';
import regionsService from '../services/regions.service';

const getAllRegions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const regions = await regionsService.getAllRegions(Number(page), Number(limit));

    return res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRegions,
};
