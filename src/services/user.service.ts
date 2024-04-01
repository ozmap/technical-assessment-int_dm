import { Request, Response } from 'express'
import { UserModel } from '../models/model'
import Geolib from '../utils/geoLib'

export const userService = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find()
      res.status(200).json(users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      res.status(500).json({ message: 'Failed to fetch users' })
    }
  },

  async getUserById(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await UserModel.findById(id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      res.status(500).json({ message: 'Failed to fetch user' })
    }
  },

  async createUser(req: Request, res: Response) {
    const { name, email, address, coordinates } = req.body

    let userCoordinates
    let userAddress

    if ((address && coordinates) || (!address && !coordinates)) {
      return res
        .status(400)
        .json({ message: 'You must provide either an address or coordinates' })
    }

    if (address) {
      try {
        userCoordinates = await Geolib.getCoordinatesFromAddress(address)
        userAddress = address
      } catch (error) {
        return res.status(400).json({
          message: 'Failed to resolve coordinates from provided address'
        })
      }
    } else {
      userCoordinates = coordinates
      try {
        userAddress = await Geolib.getAddressFromCoordinates(coordinates)
      } catch (error) {
        return res.status(400).json({
          message: 'Failed to resolve address from provided coordinates'
        })
      }
    }

    try {
      const newUser = await UserModel.create({
        name,
        email,
        address: userAddress,
        coordinates: userCoordinates
      })

      res.status(201).json(newUser)
    } catch (error) {
      console.error('Failed to create user:', error)
      res.status(500).json({ message: 'Failed to create user' })
    }
  },

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const { name, email, address, coordinates } = req.body

    let userCoordinates
    let userAddress

    if ((address && coordinates) || (!address && !coordinates)) {
      return res
        .status(400)
        .json({ message: 'You must provide either an address or coordinates' })
    }

    if (address) {
      try {
        userCoordinates = await Geolib.getCoordinatesFromAddress(address)
        userAddress = address
      } catch (error) {
        return res.status(400).json({
          message: 'Failed to resolve coordinates from provided address'
        })
      }
    } else {
      userCoordinates = coordinates
      try {
        userAddress = await Geolib.getAddressFromCoordinates(coordinates)
      } catch (error) {
        return res.status(400).json({
          message: 'Failed to resolve address from provided coordinates'
        })
      }
    }

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email, address: userAddress, coordinates: userCoordinates },
        { new: true }
      )

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(updatedUser)
    } catch (error) {
      console.error('Failed to update user:', error)
      res.status(500).json({ message: 'Failed to update user' })
    }
  },

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params

    try {
      const deletedUser = await UserModel.findByIdAndDelete(id)

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Failed to delete user:', error)
      res.status(500).json({ message: 'Failed to delete user' })
    }
  }
}
