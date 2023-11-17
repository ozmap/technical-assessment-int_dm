import { Request, Response, NextFunction } from 'express';
import { regionSchema } from './joi.schemas';
import customError from '../errors/error';
import { RegionRequestBody } from '../types/region.types';

const validateRegion = (req: Request, res: Response, next: NextFunction) => {
  try {
    const region: RegionRequestBody = req.body;

    if (region.coordinates) {
      if (typeof region.coordinates[0] !== 'number' || typeof region.coordinates[1] !== 'number') {
        throw customError({
          name: 'BAD_REQUEST',
          statusCode: 400,
          message: 'Informe coordenadas com latitude e longitude em formato numérico',
        });
      }
    }

    const { error } = regionSchema.validate(region);

    if (error) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: error.message,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateRegion;
