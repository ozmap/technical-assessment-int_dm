import { NextFunction, Request, Response } from 'express';
import customError from '../errors/error';
import { UserRequestBody } from '../types';

const validateEmail = (email: string) => {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return expression.test(email);
};

const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const user: UserRequestBody = req.body;

    if (!user.address) {
      user.address = ' ';
    }

    if (!validateEmail(user.email)) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'Formato de email inválido',
      });
    }

    const formattedAddress = user.address.split(' ').join('+');

    user.address = formattedAddress;

    console.log(user.address);
    next();
  } catch (error) {
    next(error);
  }
};

export default validateUser;
