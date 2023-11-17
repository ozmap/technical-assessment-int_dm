// import { Geocoder } from '@google/maps'

// const convertAddressToCoordinates = async (address: string): Promise<[number, number]> => {
//   const coordinates = await Geocoder.getCoordinatesFromAddress(address)
//   return coordinates
// }

// const convertCoordinatesToAddress = async (coordinates: [number, number]): Promise<string> => {
//   const address = await Geocoder.getAddressFromCoordinates(coordinates)
//   return address
// }

// const convertLocation = async (location: Location): Promise<Location> => {
//   if (location.address) {
//     location.coordinates = await convertAddressToCoordinates(location.address)
//   } else {
//     location.address = await convertCoordinatesToAddress(location.coordinates)
//   }

//   return location
// }

// const middleware = async (req, res, next) => {
//   const location = await convertLocation(req.body.location)
//   req.body.location = location
//   next()
// }
