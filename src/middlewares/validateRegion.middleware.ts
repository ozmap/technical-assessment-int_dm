import { Request, Response, NextFunction } from 'express';
import { regionSchema } from './joi.schemas';
import customError from '../errors/error';
import { RegionRequestBody } from '../types/region.types';

const validateRegion = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const region: RegionRequestBody = req.body;

    const { error } = regionSchema.validate(region);

    if (error) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: error.message,
      });
    }

    if (typeof region.coordinates.lng !== 'number' || typeof region.coordinates.lat !== 'number') {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'Informe coordenadas com latitude e longitude em formato numérico',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateRegion;
