import { NextFunction, Request, Response } from 'express';
import customError from '../errors/error';
import { UserRequestBody } from '../types';
import { userSchema } from './joi.schemas';

const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user: UserRequestBody = req.body;

    const { error } = userSchema.validate(user);

    if (error) {
      console.log(error);
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
