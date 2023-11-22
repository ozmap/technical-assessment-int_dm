import sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import { Document } from 'mongoose';
import { Region } from '../../../src/db/models';
import CustomError from '../../../src/errors/error';
import regionsMock from '../../mocks/regions.mock';
import regionsService from '../../../src/services/regions.service';
import regionsController from '../../../src/controllers/regions.controller';

chai.use(sinonChai);

type RegionTestType = {
  message: string;
  data: Document<unknown, BeAnObject, Region> &
    Omit<Region & Required<{ _id: string }>, 'typegooseName'> &
    IObjectWithTypegooseFunction;
};

type RegionsTestType = {
  message: string;
  data: (Document<unknown, BeAnObject, Region> &
    Omit<Region & Required<{ _id: string }>, 'typegooseName'> &
    IObjectWithTypegooseFunction)[];
  page: number;
  limit: number;
  total: number;
};

describe('Testing region controller', function () {
  const req = {} as Request;
  const res = {} as Response;
  let nextFunction: NextFunction;

  beforeEach(function () {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);

    nextFunction = sinon.spy() as NextFunction;

    sinon.restore();
  });

  describe('Testing getAllRegions', function () {
    it('Testing when returns statusCode 200', async function () {
      req.query = {
        page: '1',
        limit: '10',
      };

      sinon.stub(regionsService, 'getAllRegions').resolves(regionsMock.regions as RegionsTestType);

      await regionsController.getAllRegions(req, res, nextFunction);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(regionsMock.regions as RegionsTestType);
    });

    it('Testing when there is no region registered', async function () {
      req.query = {
        page: '1',
        limit: '10',
      };

      sinon.stub(regionsService, 'getAllRegions').rejects(
        new CustomError({
          name: 'NOT_FOUND',
          statusCode: 404,
          message: 'Não há nenhuma região cadastrada neste intervalo',
        }),
      );

      await regionsController.getAllRegions(req, res, nextFunction);

      expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
      expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
      expect(nextFunction).to.have.been.calledWith(
        sinon.match.has('message', 'Não há nenhuma região cadastrada neste intervalo'),
      );
    });
  });

  describe('Testing getRegionById', function () {
    it('Testing when returns statusCode 200', async function () {
      req.params = {
        id: '60d4b8b2b4c1fd1f1c7a1b5a',
      };

      sinon
        .stub(regionsService, 'getRegionById')
        .resolves({ message: 'Região obtida com sucesso', data: regionsMock.region } as RegionTestType);

      await regionsController.getRegionById(req, res, nextFunction);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        message: 'Região obtida com sucesso',
        data: regionsMock.region,
      } as RegionTestType);
    });

    it('Testing when region is not found', async function () {
      req.params = {
        id: '60d4b8b2b4c1fd1f1c7a1b5a',
      };

      sinon.stub(regionsService, 'getRegionById').rejects(
        new CustomError({
          name: 'NOT_FOUND',
          statusCode: 404,
          message: `Nenhuma região foi encontrada com o id ${req.params.id}`,
        }),
      );

      await regionsController.getRegionById(req, res, nextFunction);

      expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
      expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
      expect(nextFunction).to.have.been.calledWith(
        sinon.match.has('message', `Nenhuma região foi encontrada com o id ${req.params.id}`),
      );
    });

    describe('Testing getRegionsBySpecificPoint', function () {
      it('Testing when returns statusCode 200', async function () {
        req.params = {
          lng: '10',
          lat: '10',
        };

        sinon.stub(regionsService, 'getRegionsBySpecificPoint').resolves({
          message: 'Regiões obtidas com sucesso',
          data: [regionsMock.regionPopulatedUser],
        } as any);

        await regionsController.getRegionsBySpecificPoint(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          message: 'Regiões obtidas com sucesso',
          data: [regionsMock.regionPopulatedUser],
        });
      });

      it('Testing when throws error 500', async function () {
        req.params = {
          lng: '10000',
          lat: '10000',
        };

        sinon.stub(regionsService, 'getRegionsBySpecificPoint').rejects(
          new CustomError({
            name: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            message:
              'invalid point in geo near query $geometry argument: { type: "Point", coordinates: [ 1000, 1000 ] }  Longitude/latitude is out of bounds, lng: 1000 lat: 1000',
          }),
        );

        await regionsController.getRegionsBySpecificPoint(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 500));
      });

      it('Testing when there is no region registered', async function () {
        req.params = {
          lng: '10',
          lat: '10',
        };

        sinon.stub(regionsService, 'getRegionsBySpecificPoint').resolves({
          message: 'Regiões obtidas com sucesso',
          data: [],
        } as any);

        await regionsController.getRegionsBySpecificPoint(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          message: 'Regiões obtidas com sucesso',
          data: [],
        });
      });
    });

    describe('Testing getRegionsByDistance', function () {
      it('Testing when returns statusCode 200', async function () {
        req.query = {
          lng: '10',
          lat: '10',
          distance: '1000',
        };

        sinon.stub(regionsService, 'getRegionsByDistance').resolves({
          message: 'Regiões obtidas com sucesso',
          data: [regionsMock.regionPopulatedUser],
        } as any);

        await regionsController.getRegionsByDistance(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          message: 'Regiões obtidas com sucesso',
          data: [regionsMock.regionPopulatedUser],
        });
      });

      it('Testing when there is no region registered in the area', async function () {
        req.query = {
          lng: '10',
          lat: '10',
          distance: '10000',
        };

        sinon.stub(regionsService, 'getRegionsByDistance').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: 'Nenhuma região foi encontrada nesse raio',
          }),
        );

        await regionsController.getRegionsByDistance(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', 'Nenhuma região foi encontrada nesse raio'),
        );
      });

      it('Testing when filtering a region by user', async function () {
        req.query = {
          lng: '10',
          lat: '10',
          distance: '10000',
          user: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'getRegionsByDistance').resolves({
          message: 'Regiões obtidas com sucesso',
          data: [regionsMock.regionPopulatedUser],
        } as any);

        await regionsController.getRegionsByDistance(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({
          message: 'Regiões obtidas com sucesso',
          data: [regionsMock.regionPopulatedUser],
        });
      });

      it('Testing when filtering a region by invalid user', async function () {
        req.query = {
          lng: '10',
          lat: '10',
          distance: '10000',
          user: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'getRegionsByDistance').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: 'Nenhuma região pertence a esse usuário',
          }),
        );

        await regionsController.getRegionsByDistance(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', 'Nenhuma região pertence a esse usuário'),
        );
      });
    });

    describe('Testing createRegion', function () {
      it('Testing when returns statusCode 201', async function () {
        req.body = {
          name: 'Teste',
          coordinates: [10, 10],
          user: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'createRegion').resolves({
          message: 'Região criada com sucesso',
          data: regionsMock.region,
        } as RegionTestType);

        await regionsController.createRegion(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(201);
      });

      it('Testing when user is not found', async function () {
        req.body = {
          name: 'Teste',
          coordinates: [10, 10],
          user: '60d4b8b2b4c1fd1f1c7',
        };

        sinon.stub(regionsService, 'createRegion').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: 'Nenhum usuário foi encontrado com esse id',
          }),
        );

        await regionsController.createRegion(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', 'Nenhum usuário foi encontrado com esse id'),
        );
      });

      it('Testing when region is already registered', async function () {
        req.body = {
          name: 'Teste',
          coordinates: [10, 10],
          user: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'createRegion').rejects(
          new CustomError({
            name: 'UNPROCESSABLE_ENTITY',
            statusCode: 422,
            message: 'Essa região já está cadastrada',
          }),
        );

        await regionsController.createRegion(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 422));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('message', 'Essa região já está cadastrada'));
      });
    });

    describe('Testing updateRegion', function () {
      it('Testing when returns statusCode 201', async function () {
        req.body = {
          name: 'Teste',
          coordinates: [10, 10],
          user: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        req.params = {
          id: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'updateRegion').resolves({
          message: 'Região atualizada com sucesso',
          data: regionsMock.region,
        } as RegionTestType);

        await regionsController.updateRegion(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({
          message: 'Região atualizada com sucesso',
          data: regionsMock.region,
        } as RegionTestType);
      });

      it('Testing when region is not found', async function () {
        req.body = {
          name: 'Teste',
          coordinates: [10, 10],
          user: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        req.params = {
          id: '60d4b8b2b4c1fd1f1c7a',
        };

        sinon.stub(regionsService, 'updateRegion').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: `Nenhuma região foi encontrada com o id ${req.params.id}`,
          }),
        );

        await regionsController.updateRegion(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', `Nenhuma região foi encontrada com o id ${req.params.id}`),
        );
      });

      it('Testing when user is not found', async function () {
        req.body = {
          name: 'Teste',
          coordinates: [10, 10],
          user: '010201',
        };

        req.params = {
          id: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'updateRegion').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: 'Nenhum usuário foi encontrado com esse id',
          }),
        );

        await regionsController.updateRegion(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', 'Nenhum usuário foi encontrado com esse id'),
        );
      });
    });

    describe('Testing deleteRegion', function () {
      it('Testing when returns statusCode 204', async function () {
        req.params = {
          id: '60d4b8b2b4c1fd1f1c7a1b5a',
        };

        sinon.stub(regionsService, 'deleteRegion').resolves();

        await regionsController.deleteRegion(req, res, nextFunction);

        expect(res.status).to.have.been.calledWith(204);
      });

      it('Testing when a region is not found', async function () {
        req.params = {
          id: '6c7a1b5a',
        };

        sinon.stub(regionsService, 'deleteRegion').rejects(
          new CustomError({
            name: 'NOT_FOUND',
            statusCode: 404,
            message: `Nenhuma região foi encontrada com o id ${req.params.id}`,
          }),
        );

        await regionsController.deleteRegion(req, res, nextFunction);

        expect(nextFunction).to.have.been.calledWith(sinon.match.instanceOf(CustomError));
        expect(nextFunction).to.have.been.calledWith(sinon.match.has('statusCode', 404));
        expect(nextFunction).to.have.been.calledWith(
          sinon.match.has('message', `Nenhuma região foi encontrada com o id ${req.params.id}`),
        );
      });
    });
  });
});
