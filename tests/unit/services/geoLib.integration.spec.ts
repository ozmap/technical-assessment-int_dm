import axios from 'axios';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import geoLibIntegration from '../../../src/services/geoLib.integration';
import CustomError from '../../../src/errors/error';

chai.use(sinonChai);

describe('Testing geoLib integration', function () {
  beforeEach(function () {
    sinon.restore();
  });

  it('Testing getAddressFromCoordinates', async function () {
    sinon.stub(axios, 'get').resolves({
      statusText: 'OK',
      data: {
        results: [
          {
            formatted_address: 'Rua das Flores, 100, São Paulo, SP',
          },
        ],
      },
    });

    const getAddressFromCoordinates = await geoLibIntegration.getAddressFromCoordinates({ lat: -5, lng: -5 });

    expect(getAddressFromCoordinates).to.be.equal('Rua das Flores, 100, São Paulo, SP');
  });

  it('Testing getAdressFromCoordinates with invalid response', async function () {
    sinon.stub(axios, 'get').resolves({
      statusText: 'NOT OK',
    });

    const getAddressFromCoordinates = geoLibIntegration.getAddressFromCoordinates({ lat: -5, lng: -5 });

    await expect(getAddressFromCoordinates).to.be.rejectedWith(CustomError, 'Resposta inválida da Geocoding API');
  });

  it('Testing getAdressFromCoordinates with no results', async function () {
    sinon.stub(axios, 'get').resolves({
      statusText: 'OK',
      data: {
        results: [],
      },
    });

    const getAddressFromCoordinates = geoLibIntegration.getAddressFromCoordinates({ lat: -5, lng: -5 });

    await expect(getAddressFromCoordinates).to.be.rejectedWith(
      CustomError,
      'Nenhum endereço foi encontrado com as coordenadas informadas',
    );
  });

  it('Testing getCoordinatesFromAddress', async function () {
    sinon.stub(axios, 'get').resolves({
      statusText: 'OK',
      data: {
        results: [
          {
            geometry: {
              location: {
                lat: -5,
                lng: -5,
              },
            },
          },
        ],
      },
    });

    const getCoordinatesFromAddress = await geoLibIntegration.getCoordinatesFromAddress('00000000');

    expect(getCoordinatesFromAddress).to.be.deep.equal({ lat: -5, lng: -5 });
  });

  it('Testing getCoordinatesFromAddress with invalid response', async function () {
    sinon.stub(axios, 'get').resolves({
      statusText: 'NOT OK',
    });

    const getCoordinatesFromAddress = geoLibIntegration.getCoordinatesFromAddress('00000000');

    await expect(getCoordinatesFromAddress).to.be.rejectedWith(CustomError, 'Resposta inválida da Geocoding API');
  });

  it('Testing getCoordinatesFromAddress with no results', async function () {
    sinon.stub(axios, 'get').resolves({
      statusText: 'OK',
      data: {
        results: [],
      },
    });

    const getCoordinatesFromAddress = geoLibIntegration.getCoordinatesFromAddress('00000000');

    await expect(getCoordinatesFromAddress).to.be.rejectedWith(
      CustomError,
      'Nenhuma coordenada foi encontrada com o CEP informado',
    );
  });
});
