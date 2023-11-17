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

    if (user.coordinates) {
      if (typeof user.coordinates[0] !== 'number' || typeof user.coordinates[1] !== 'number') {
        throw customError({
          name: 'BAD_REQUEST',
          statusCode: 400,
          message: 'Informe coordenadas com latitude e longitude em formato numérico',
        });
      }
    }

    const { error } = userSchema.validate(user);

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

export default validateUser;
