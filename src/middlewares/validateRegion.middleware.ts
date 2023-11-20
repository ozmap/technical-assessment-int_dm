import { Request, Response, NextFunction } from 'express';
import { regionSchema } from './joi.schemas';
import { RegionRequestBody } from '../types/region.types';
import CustomError from '../errors/error';

const validateRegion = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const region: RegionRequestBody = req.body;

    const { error } = regionSchema.validate(region);

    if (error) {
      throw new CustomError({
        name: 'UNPROCESSABLE_ENTITY',
        statusCode: 422,
        message: error.message,
      });
    }

    if (typeof region?.coordinates?.lng === 'string' || typeof region?.coordinates?.lat === 'string') {
      throw new CustomError({
        name: 'UNPROCESSABLE_ENTITY',
        statusCode: 422,
        message: 'Informe coordenadas com latitude e longitude em formato numérico',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateRegion;
