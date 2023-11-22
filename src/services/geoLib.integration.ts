import axios from 'axios';
import CustomError from '../errors/error';

const API_KEY = process.env.GOOGLE_API_KEY;
const GEOCODING_REVERSE_URL = process.env.GOOGLE_GEOCODING_REVERSE_URL;
const GEOCODING_URL = process.env.GOOGLE_GEOCODING_URL;

class GeoLib {
  public async getAddressFromCoordinates(coordinates: { lat: number; lng: number }): Promise<string> {
    const response = await axios.get(`${GEOCODING_REVERSE_URL}${coordinates.lat},${coordinates.lng}&key=${API_KEY}`);

    if (response.statusText !== 'OK') {
      throw new CustomError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'Resposta inválida da Geocoding API',
      });
    }

    if (!response.data.results.length) {
      throw new CustomError({
        name: 'NOT_FOUND',
        statusCode: 404,
        message: 'Nenhum endereço foi encontrado com as coordenadas informadas',
      });
    }

    return response.data.results[0].formatted_address;
  }

  public async getCoordinatesFromAddress(zipcode: string): Promise<{ lat: number; lng: number }> {
    const response = await axios.get(`${GEOCODING_URL}${zipcode}&key=${API_KEY}`);

    if (response.statusText !== 'OK') {
      throw new CustomError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'Resposta inválida da Geocoding API',
      });
    }

    if (!response.data.results.length) {
      throw new CustomError({
        name: 'NOT_FOUND',
        statusCode: 404,
        message: 'Nenhuma coordenada foi encontrada com o CEP informado',
      });
    }

    return response.data.results[0].geometry.location;
  }
}

export default new GeoLib();
