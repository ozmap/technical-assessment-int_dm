import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import CustomError from '../../../src/errors/error';
import { UserModel, RegionModel } from '../../../src/db/models';
import usersMock from '../../mocks/users.mock';
import regionsMock from '../../mocks/regions.mock';
import regionsService from '../../../src/services/regions.service';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Testing regions service', function () {
  beforeEach(function () {
    sinon.restore();
  });

  describe('Testing getAllRegions', function () {
    it('Should return an object with message, data, page, limit and total properties', async function () {
      sinon
        .mock(RegionModel)
        .expects('find')
        .returns({
          limit: sinon.stub().returns({
            skip: sinon.stub().resolves([regionsMock.regions]),
          }),
        });
      sinon.stub(RegionModel, 'count').resolves(1);

      const result = await regionsService.getAllRegions(1, 10);

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Regiões obtidas com sucesso');
      expect(result).to.have.property('data');
      expect(result.data).to.be.deep.equal([regionsMock.regions]);
      expect(result).to.have.property('page');
      expect(result).to.have.property('limit');
      expect(result).to.have.property('total');
    });

    it('Should return an error menssage when there is no region in the database', async function () {
      sinon
        .mock(RegionModel)
        .expects('find')
        .returns({
          limit: sinon.stub().returns({
            skip: sinon.stub().resolves([]),
          }),
        });
      sinon.stub(RegionModel, 'count').resolves(0);

      await expect(regionsService.getAllRegions(1, 10)).to.be.rejectedWith(
        CustomError,
        'Não há nenhuma região cadastrada neste intervalo',
      );
    });
  });

  describe('Testing getRegionById', function () {
    it('Should return an object with message and data properties', async function () {
      sinon
        .mock(RegionModel)
        .expects('findOne')
        .returns({
          populate: sinon.stub().resolves(regionsMock.regionPopulatedUser),
        });

      const result = await regionsService.getRegionById('123');

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Região obtida com sucesso');
      expect(result).to.have.property('data');
      expect(result.data).to.be.deep.equal(regionsMock.regionPopulatedUser);
    });

    it('Should throw an error when the region is not found', async function () {
      sinon
        .mock(RegionModel)
        .expects('findOne')
        .returns({
          populate: sinon.stub().resolves(null),
        });

      await expect(regionsService.getRegionById('123')).to.be.rejectedWith(
        CustomError,
        'Nenhuma região foi encontrada com o id 123',
      );
    });
  });

  describe('Testing getRegionsBySpecificPoint', function () {
    it('Should return an object with message and data properties', async function () {
      sinon
        .mock(RegionModel)
        .expects('find')
        .withArgs({
          coordinates: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [1, 1],
              },
            },
          },
        })
        .returns({
          populate: sinon.stub().resolves([regionsMock.regionPopulatedUser]),
        });

      const result = await regionsService.getRegionsBySpecificPoint(1, 1);

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Regiões obtidas com sucesso');
      expect(result).to.have.property('data');
      expect(result.data).to.be.deep.equal([regionsMock.regionPopulatedUser]);
    });
  });

  describe('Testing getRegionsByDistance', function () {
    it('Should return an object with message and data properties', async function () {
      sinon
        .mock(RegionModel)
        .expects('find')
        .withArgs({
          coordinates: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [1, 1],
              },
              $maxDistance: 1000,
            },
          },
        })
        .resolves(regionsMock.regionsByDistanceMock);

      const result = await regionsService.getRegionsByDistance(1, 1, 1000);

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Regiões obtidas com sucesso');
      expect(result).to.have.property('data');
      expect(result.data).to.be.deep.equal(regionsMock.regionsByDistanceMock);
    });

    it('Should throw an error when the userId is passed and the user does not have any region', async function () {
      sinon.stub(RegionModel, 'find').resolves(regionsMock.regionsByDistanceMock);

      await expect(regionsService.getRegionsByDistance(1, 1, 1000, '6558f4c6abd3c88df1a63b40')).to.be.rejectedWith(
        CustomError,
        'Nenhuma região pertence a esse usuário',
      );
    });

    it('Should return an object with message and data properties when the userId is passed and the user has regions', async function () {
      sinon.stub(RegionModel, 'find').resolves(regionsMock.regionsByDistanceMock);

      const result = await regionsService.getRegionsByDistance(1, 1, 1000, '6558f4c6abd3c88df1a63b75');

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Regiões obtidas com sucesso');
      expect(result).to.have.property('data');
    });

    it('Should throw an error when there is no region', async function () {
      sinon.stub(RegionModel, 'find').resolves([]);

      await expect(regionsService.getRegionsByDistance(1, 1, 1000)).to.be.rejectedWith(
        CustomError,
        'Nenhuma região foi encontrada nesse raio',
      );
    });
  });

  describe('Testing createRegion', function () {
    it('Testing when user is not found', async function () {
      sinon.stub(UserModel, 'findById').resolves(null);

      await expect(regionsService.createRegion(regionsMock.regionRequestBody)).to.be.rejectedWith(
        CustomError,
        'Nenhum usuário foi encontrado com esse id',
      );
    });

    it('Testing when region is already registered', async function () {
      sinon.stub(UserModel, 'findById').resolves(usersMock.user);
      sinon.stub(RegionModel, 'findOne').resolves(regionsMock.region);

      await expect(regionsService.createRegion(regionsMock.regionRequestBody)).to.be.rejectedWith(
        CustomError,
        'Essa região já está cadastrada',
      );
    });

    it('Testing creating region successfully', async function () {
      sinon.stub(UserModel, 'findById').resolves(usersMock.user);
      sinon.stub(RegionModel, 'findOne').resolves(null);
      sinon.stub(RegionModel, 'create').resolves(regionsMock.region as any);

      const result = await regionsService.createRegion(regionsMock.regionRequestBody);

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Região criada com sucesso');
      expect(result).to.have.property('data');
      expect(result.data).to.be.deep.equal(regionsMock.region);
    });
  });

  describe('Testing updateRegion', function () {
    it('Testing when region is not found', async function () {
      sinon.stub(RegionModel, 'findOne').resolves(null);

      await expect(
        regionsService.updateRegion(regionsMock.regionRequestBody, '6558f4c6abd3c88df1a63b75'),
      ).to.be.rejectedWith(CustomError, 'Nenhuma região foi encontrada com o id 6558f4c6abd3c88df1a63b75');
    });

    it('Testing when user is not found', async function () {
      sinon.stub(RegionModel, 'findOne').resolves(regionsMock.region);
      sinon.stub(UserModel, 'findOne').resolves(null);

      await expect(
        regionsService.updateRegion(regionsMock.regionRequestBody, '6558f4c6abd3c88df1a63b75'),
      ).to.be.rejectedWith(CustomError, 'Insira um id de usuário válido');
    });

    it('Testing update region sucessfuly', async function () {
      sinon.stub(RegionModel, 'findOne').resolves(regionsMock.region);
      sinon.stub(UserModel, 'findOne').resolves(usersMock.user).onSecondCall().resolves(usersMock.user);
      sinon.stub(RegionModel, 'updateOne').resolves(null);

      const result = await regionsService.updateRegion(
        {
          ...regionsMock.regionRequestBody,
          user: usersMock.user._id,
        },
        regionsMock.region._id,
      );

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Região atualizada com sucesso');
    });

    it('Testing updating region successfully with different userId', async function () {
      sinon.stub(RegionModel, 'findOne').resolves(regionsMock.region);
      sinon.stub(UserModel, 'findOne').resolves(usersMock.user).onSecondCall().resolves(usersMock.user);
      sinon.stub(UserModel, 'updateOne').resolves(null).onSecondCall().resolves(null);
      sinon.stub(RegionModel, 'updateOne').resolves(null);

      const result = await regionsService.updateRegion(regionsMock.regionRequestBody, '6558f4c6abd3c88df1a63b75');

      expect(result).to.have.property('message');
      expect(result.message).to.be.equal('Região atualizada com sucesso');
    });
  });

  describe('Testing deleteRegion', function () {
    it('Testing when region is not found', async function () {
      sinon.stub(RegionModel, 'findOne').resolves(null);

      await expect(regionsService.deleteRegion('6558f4c6abd3c88df1a63b75')).to.be.rejectedWith(
        CustomError,
        'Nenhuma região foi encontrada com o id 6558f4c6abd3c88df1a63b75',
      );
    });

    it('Testing deleting region successfully', async function () {
      sinon.stub(RegionModel, 'findOne').resolves(regionsMock.region);
      sinon.stub(UserModel, 'updateOne').resolves(null);
      sinon.stub(RegionModel, 'deleteOne').resolves(null);

      expect(() => regionsService.deleteRegion(regionsMock.region._id)).to.not.have.throw();
    });
  });
});
