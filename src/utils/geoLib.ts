class GeoLib {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org'
  }

  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number }
  ): Promise<string> {
    const lat = Array.isArray(coordinates) ? coordinates[0] : coordinates.lat
    const lon = Array.isArray(coordinates) ? coordinates[1] : coordinates.lng

    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      const data = await response.json()
      return data.display_name
    } catch (error) {
      throw new Error('Failed to get address from coordinates')
    }
  }

  public async getCoordinatesFromAddress(
    address: string
  ): Promise<[number, number]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?format=json&q=${encodeURIComponent(address)}`
      )
      const data = await response.json()
      const { lat, lon } = data[0]
      return [parseFloat(lat), parseFloat(lon)]
    } catch (error) {
      throw new Error('Failed to get coordinates from address')
    }
  }
}

export default new GeoLib()
