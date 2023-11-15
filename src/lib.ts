class GeoLib {
  public getAddressFromCoordinates(req) {
    let coordinates = req.body.coordinates;
    console.log({ coordinates: coordinates });
    return coordinates;
  }

  //   coordinates: [number, number] | { lat: number; lng: number }
  // ): Promise<string> {
  //   return
  //   Promise.reject(new Error("AQUI ---> Not implemented"));

  public getCoordinatesFromAddress(req) {
    let address = req.body.address;
    console.log({ address: address });
    return address;
  }
  //   address: string
  // ): Promise<{ lat: number; lng: number }> {
  //   return Promise.reject(new Error("No segundo ---> Not implemented"));
}

export default new GeoLib();
