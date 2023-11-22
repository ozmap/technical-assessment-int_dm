import { NextFunction, Request, Response } from 'express';
import { userSchema } from './joi.schemas';
import { UserRequestBody } from '../types/user.types';
import CustomError from '../errors/error';

const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user: UserRequestBody = req.body;

    if (!user?.coordinates && !user?.address) {
      throw new CustomError({
        name: 'UNPROCESSABLE_ENTITY',
        statusCode: 422,
        message: 'É necessário o endereço ou as coordenadas',
      });
    }

    const { error } = userSchema.validate(user);

    if (error) {
      throw new CustomError({
        name: 'UNPROCESSABLE_ENTITY',
        statusCode: 422,
        message: error.message,
      });
    }

    if (typeof user?.coordinates?.lng === 'string' || typeof user?.coordinates?.lat === 'string') {
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

export default validateUser;
