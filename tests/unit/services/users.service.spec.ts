import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import CustomError from '../../../src/errors/error';
import usersService from '../../../src/services/users.service';
import { UserModel } from '../../../src/db/models';
import usersMock from '../../mocks/users.mock';
import regionsMock from '../../mocks/regions.mock';
import geoLibIntegration from '../../../src/services/geoLib.integration';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Testing user service', function () {
  beforeEach(function () {
    sinon.restore();
  });

  describe('Testin getAllUsers function', function () {
    it('Testing with users registered', async function () {
      sinon
        .mock(UserModel)
        .expects('find')
        .returns({
          limit: sinon.stub().returns({
            skip: sinon.stub().resolves([usersMock.users]),
          }),
        });

      sinon.stub(UserModel, 'count').resolves(1);

      const serviceResponse = await usersService.getAllUsers(1, 10);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuários obtidos com sucesso');
      expect(serviceResponse).to.have.property('data');
      expect(serviceResponse).to.have.property('page');
      expect(serviceResponse).to.have.property('limit');
      expect(serviceResponse).to.have.property('total');
    });

    it('Testing without users registered', async function () {
      sinon
        .mock(UserModel)
        .expects('find')
        .returns({
          limit: sinon.stub().returns({
            skip: sinon.stub().resolves([]),
          }),
        });

      sinon.stub(UserModel, 'count').resolves(0);

      await expect(usersService.getAllUsers(1, 10)).to.be.rejectedWith(
        CustomError,
        'Não há nenhum usuário cadastrado neste intervalo',
      );
    });
  });

  describe('Testing getUserById function', function () {
    it('Testing with a existing user', async function () {
      sinon
        .mock(UserModel)
        .expects('findOne')
        .returns({
          populate: sinon.stub().resolves({ ...usersMock.user, regions: [regionsMock.region] }),
        });

      const serviceResponse = await usersService.getUserById(usersMock.user._id);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuário obtido com sucesso');
      expect(serviceResponse).to.have.property('data');
      expect(serviceResponse.data).to.be.deep.equal(usersMock.user);
    });

    it('Testing with a non-existing user', async function () {
      sinon
        .mock(UserModel)
        .expects('findOne')
        .returns({
          populate: sinon.stub().resolves(null),
        });

      await expect(usersService.getUserById('1')).to.be.rejectedWith(
        CustomError,
        'Nenhum usuário foi encontrado com o id 1',
      );
    });
  });

  describe('Testing updateUserById function', function () {
    it('Testing with invalid id', async function () {
      sinon.stub(UserModel, 'findOne').resolves(null);
      await expect(usersService.updateUserById('1', usersMock.userRequestBody)).to.be.rejectedWith(
        CustomError,
        'Nenhum usuário foi encontrado com o id 1',
      );
    });

    it('Testing with valid id and coordinates', async function () {
      sinon.stub(UserModel, 'findOne').resolves(usersMock.user);
      sinon.stub(geoLibIntegration, 'getAddressFromCoordinates').resolves(usersMock.user.address);
      sinon.stub(UserModel, 'updateOne').resolves(null);

      const serviceResponse = await usersService.updateUserById('1', usersMock.userRequestBody);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuário atualizado com sucesso');
    });

    it('Testing with valid id and address', async function () {
      sinon.stub(UserModel, 'findOne').resolves(usersMock.user);
      sinon.stub(geoLibIntegration, 'getCoordinatesFromAddress').resolves({
        lat: usersMock.user.coordinates[1],
        lng: usersMock.user.coordinates[0],
      });
      sinon.stub(UserModel, 'updateOne').resolves(null);

      const serviceResponse = await usersService.updateUserById('1', usersMock.userRequestBody2);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuário atualizado com sucesso');
    });
  });

  describe('Testing createUser function', function () {
    it('Testing with a email already in use', async function () {
      sinon.stub(UserModel, 'findOne').resolves(usersMock.user);
      await expect(usersService.createUser(usersMock.userRequestBody)).to.be.rejectedWith(
        CustomError,
        'Email já está cadastrado',
      );
    });

    it('Testing with valid email and body request with an address ', async function () {
      sinon.stub(UserModel, 'findOne').resolves(null);
      sinon.stub(geoLibIntegration, 'getCoordinatesFromAddress').resolves({
        lat: usersMock.user.coordinates[1],
        lng: usersMock.user.coordinates[0],
      });
      sinon.stub(UserModel, 'create').resolves(usersMock.user as any);

      const serviceResponse = await usersService.createUser(usersMock.userRequestBody2);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuário criado com sucesso');
    });

    it('Testing with valid email and body request without an address number ', async function () {
      sinon.stub(UserModel, 'findOne').resolves(null);
      sinon.stub(geoLibIntegration, 'getCoordinatesFromAddress').resolves({
        lat: usersMock.user.coordinates[1],
        lng: usersMock.user.coordinates[0],
      });
      sinon.stub(UserModel, 'create').resolves(usersMock.user as any);

      const serviceResponse = await usersService.createUser(usersMock.userRequestBody3);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuário criado com sucesso');
    });

    it('Testing with a valid email and body request with coordinates', async function () {
      sinon.stub(UserModel, 'findOne').resolves(null);
      sinon.stub(geoLibIntegration, 'getAddressFromCoordinates').resolves(usersMock.user.address);
      sinon.stub(UserModel, 'create').resolves(usersMock.user as any);

      const serviceResponse = await usersService.createUser(usersMock.userRequestBody);

      expect(serviceResponse).to.be.an('object');
      expect(serviceResponse).to.have.property('message');
      expect(serviceResponse.message).to.be.equal('Usuário criado com sucesso');
    });

    describe('Testing deleteUser function', function () {
      it('Testing with a invalid id', async function () {
        sinon.stub(UserModel, 'findByIdAndDelete').resolves(null);

        await expect(usersService.deleteUser('1')).to.be.rejectedWith(
          CustomError,
          'Nenhum usuário foi encontrado com o id 1',
        );
      });

      it('Testing with a valid id', async function () {
        sinon.stub(UserModel, 'findByIdAndDelete').resolves(usersMock.user);

        expect(() => usersService.deleteUser('6558f3eaabd3c88df1a63b72')).to.not.have.throw();
      });
    });
  });
});
