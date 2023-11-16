const API_KEY = process.env.GOOGLE_API_KEY;

class GeoLib {
  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${API_KEY}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => data.results[1].formatted_address);
  }

  public async getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number }> {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => data.results[0].geometry.location);
  }
}

export default new GeoLib();
