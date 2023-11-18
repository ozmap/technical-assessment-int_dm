import { NextFunction, Request, Response } from 'express';
import customError from '../errors/error';
import { userSchema } from './joi.schemas';
import { UserRequestBody } from '../types/user.types';

const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user: UserRequestBody = req.body;

    if (!user.coordinates && !user.address) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'É necessário o endereço ou as coordenadas',
      });
    }

    const { error } = userSchema.validate(user);

    if (error) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: error.message,
      });
    }

    if (typeof user.coordinates.lng !== 'number' || typeof user.coordinates.lat !== 'number') {
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

export default validateUser;
