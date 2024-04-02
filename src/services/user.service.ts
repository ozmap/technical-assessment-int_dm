import { UserModel } from '../models/model'
import Geolib from '../utils/geoLib'

export async function getAllUsers() {
  return await UserModel.find()
}

export async function getUserById(id: string) {
  return await UserModel.findById(id)
}

export async function createUser(
  name: string,
  email: string,
  address: string,
  coordinates: [number, number]
) {
  let userCoordinates: [number, number]
  let userAddress: string

  if ((address && coordinates) || (!address && !coordinates)) {
    throw new Error('You must provide either an address or coordinates')
  }

  if (address) {
    userCoordinates = await Geolib.getCoordinatesFromAddress(address)
    userAddress = address
  } else {
    userCoordinates = coordinates
    userAddress = await Geolib.getAddressFromCoordinates(coordinates)
  }

  return await UserModel.create({
    name,
    email,
    address: userAddress,
    coordinates: userCoordinates
  })
}

export async function updateUser(
  id: string,
  name: string,
  email: string,
  address: string,
  coordinates: [number, number]
) {
  let userCoordinates: [number, number]
  let userAddress: string

  if ((address && coordinates) || (!address && !coordinates)) {
    throw new Error('You must provide either an address or coordinates')
  }

  if (address) {
    userCoordinates = await Geolib.getCoordinatesFromAddress(address)
    userAddress = address
  } else {
    userCoordinates = coordinates
    userAddress = await Geolib.getAddressFromCoordinates(coordinates)
  }

  return await UserModel.findByIdAndUpdate(
    id,
    { name, email, address: userAddress, coordinates: userCoordinates },
    { new: true }
  )
}

export async function deleteUser(id: string) {
  return await UserModel.findByIdAndDelete(id)
}
