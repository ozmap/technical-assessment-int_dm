import axios from 'axios';
import customError from '../errors/error';

const API_KEY = process.env.GOOGLE_API_KEY;
const GEOCODING_REVERSE_URL = process.env.GOOGLE_GEOCODING_REVERSE_URL;
const GEOCODING_URL = process.env.GOOGLE_GEOCODING_URL;

class GeoLib {
  public async getAddressFromCoordinates(coordinates: { lat: number; lng: number }): Promise<string> {
    const response = await axios.get(`${GEOCODING_REVERSE_URL}${coordinates.lat},${coordinates.lng}&key=${API_KEY}`);

    if (response.statusText !== 'OK') {
      throw new Error('Resposta inválida da Geocoding API');
    }

    if (!response.data.results.length) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'Coordenadas inválidas',
      });
    }

    return response.data.results[0].formatted_address;
  }

  public async getCoordinatesFromAddress(zipcode: string): Promise<{ lat: number; lng: number }> {
    const response = await axios.get(`${GEOCODING_URL}${zipcode}&key=${API_KEY}`);

    if (response.statusText !== 'OK') {
      throw new Error('Resposta inválida da Geocoding API');
    }

    if (!response.data.results.length) {
      throw customError({
        name: 'BAD_REQUEST',
        statusCode: 400,
        message: 'CEP inválido',
      });
    }

    return response.data.results[0].geometry.location;
  }
}

export default new GeoLib();
