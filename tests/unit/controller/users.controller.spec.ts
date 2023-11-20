import sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import usersController from '../../../src/controllers/users.controller';
import usersService from '../../../src/services/users.service';
import usersMock from '../../mocks/users.mock';
import { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import { Document } from 'mongoose';
import { User } from '../../../src/db/models';
import CustomError from '../../../src/errors/error';

chai.use(sinonChai);

export type UserTestType = {
  message: string;
  data: Document<unknown, BeAnObject, User> &
    Omit<User & Required<{ _id: string }>, 'typegooseName'> &
    IObjectWithTypegooseFunction;
};

export type UsersTestType = {
  message: string;
  data: (Document<unknown, BeAnObject, User> &
    Omit<User & Required<{ _id: string }>, 'typegooseName'> &
    IObjectWithTypegooseFunction)[];
  page: number;
  limit: number;
  total: number;
};

describe('Testing users controller', function () {
  const req = {} as Request;
  const res = {} as Response;
  let nextFunction: NextFunction;

  beforeEach(function () {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);

    nextFunction = sinon.spy() as NextFunction;

    sinon.restore();
  });

  describe('Testing getAllUsers', function () {
    it('Testing when returns statusCode 200', async function () {
      req.query = {
        page: '1',
        limit: '10',
      };

      sinon.stub(usersService, 'getAllUsers').resolves(usersMock.getAllUsersMock as UsersTestType);

      await usersController.getAllUsers(req, res, nextFunction);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(usersMock.getAllUsersMock);
    });

    it('Testing when no users are registered', async function () {
      req.query = {
        page: '1',
        limit: '10',
      };

      sinon.stub(usersService, 'getAllUsers').resolves(usersMock.getAllUsersMock2 as UsersTestType);

      await usersController.getAllUsers(req, res, nextFunction);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(usersMock.getAllUsersMock2);
    });
  });

  describe('Testing getUserById', function () {
    it('Testing when returns statusCode 200', async function () {
      req.params = {
        id: '6556ec440f88926eec7b0acf',
      };

      sinon
        .stub(usersService, 'getUserById')
        .resolves({ message: 'Usuário obtido com sucesso', data: usersMock.user } as UserTestType);

      await usersController.getUserById(req, res, nextFunction);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        message: 'Usuário obtido com sucesso',
        data: usersMock.user,
      } as UserTestType);
    });

    it('Testing when user is not found', async function () {
      req.params = {
        id: '6556ec',
      };

      sinon.stub(usersService, 'getUserById').rejects(
        new CustomError({
          name: 'NOT_FOUND',
          statusCode: 404,
          message: `Nenhum usuário foi encontrado com o id ${req.params.id}`,
        }),
      );

      await usersController.getUserById(req, res, nextFunction);

      expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
      expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
      expect(nextFunction).to.have.been.calledWith(
        sinon.match.has('message', `Nenhum usuário foi encontrado com o id ${req.params.id}`),
      );
    });

    describe('Testing updateUserById', function () {
      it('Testing when returns statusCode 201', async function () {
        req.params = {
          id: '6556ec440f88926eec7b0acf',
        };

        req.body = {
          name: 'Test',
          email: 'teste@test.com',
          coordinates: {
            lat: '-4.5',
            lng: '1.2',
          },
        };

        sinon.stub(usersService, 'updateUserById').resolves({ message: 'Usuário atualizado com sucesso' });

        await usersController.updateUserById(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'Usuário atualizado com sucesso' });
      });

      it('Testing when user is not found', async function () {
        req.params = {
          id: '6556ec',
        };

        req.body = {
          name: 'Test',
          email: 'teste@test.com',
          coordinates: {
            lat: '-4.5',
            lng: '1.2',
          },
        };

        sinon.stub(usersService, 'updateUserById').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: `Nenhum usuário foi encontrado com o id ${req.params.id}`,
          }),
        );

        await usersController.updateUserById(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', `Nenhum usuário foi encontrado com o id ${req.params.id}`),
        );
      });
    });

    describe('Testing createUser', function () {
      it('Testing when returns statusCode 201', async function () {
        req.body = {
          name: 'Test',
          email: 'teste@test.com',
          coordinates: {
            lat: '-4.5',
            lng: '1.2',
          },
        };

        sinon
          .stub(usersService, 'createUser')
          .resolves({ message: 'Usuário criado com sucesso', data: usersMock.user } as UserTestType);

        await usersController.createUser(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ message: 'Usuário criado com sucesso', data: usersMock.user });
      });

      it('Testing when user already exist', async function () {
        req.body = {
          name: 'Test',
          email: 'teste@test.com',
          coordinates: {
            lat: '-4.5',
            lng: '1.2',
          },
        };

        sinon.stub(usersService, 'createUser').rejects(
          new CustomError({
            name: 'UNPROCESSABLE_ENTITY',
            statusCode: 422,
            message: 'Email já está cadastrado',
          }),
        );

        await usersController.createUser(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 422));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('message', 'Email já está cadastrado'));
      });
    });

    describe('Testing deleteUser', function () {
      it('Testing when returns statusCode 204', async function () {
        req.params = {
          id: '6556ec440f88926eec7b0acf',
        };

        sinon.stub(usersService, 'deleteUser').resolves(null);

        await usersController.deleteUser(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(204);
      });

      it('Testing when user is not found', async function () {
        req.params = {
          id: '6556ec',
        };

        sinon.stub(usersService, 'deleteUser').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: `Nenhum usuário foi encontrado com o id ${req.params.id}`,
          }),
        );

        await usersController.deleteUser(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', `Nenhum usuário foi encontrado com o id ${req.params.id}`),
        );
      });
    });
  });
});
