import { Request, Response } from 'express'
import { RegionModel } from '../models/model'

export const regionService = {
  async getAllRegions(req: Request, res: Response) {
    try {
      const regions = await RegionModel.find()
      res.status(200).json(regions)
    } catch (error) {
      console.error('Failed to fetch regions:', error)
      res.status(500).json({ message: 'Failed to fetch regions' })
    }
  },

  async getRegionById(req: Request, res: Response) {
    const { id } = req.params
    try {
      const region = await RegionModel.findById(id)
      if (!region) {
        return res.status(404).json({ message: 'Region not found' })
      }
      res.status(200).json(region)
    } catch (error) {
      console.error('Failed to fetch region:', error)
      res.status(500).json({ message: 'Failed to fetch region' })
    }
  },

  async createRegion(req: Request, res: Response) {
    const { name, coordinates, userId } = req.body

    try {
      const newRegion = await RegionModel.create({
        name,
        coordinates,
        user: userId
      })

      res.status(201).json(newRegion)
    } catch (error) {
      console.error('Failed to create region:', error)
      res.status(500).json({ message: 'Failed to create region' })
    }
  },

  async updateRegion(req: Request, res: Response) {
    const { id } = req.params
    const { name, coordinates } = req.body

    try {
      const updatedRegion = await RegionModel.findByIdAndUpdate(
        id,
        { name, coordinates },
        { new: true }
      )

      if (!updatedRegion) {
        return res.status(404).json({ message: 'Region not found' })
      }

      res.status(200).json(updatedRegion)
    } catch (error) {
      console.error('Failed to update region:', error)
      res.status(500).json({ message: 'Failed to update region' })
    }
  },

  async deleteRegion(req: Request, res: Response) {
    const { id } = req.params

    try {
      const deletedRegion = await RegionModel.findByIdAndDelete(id)

      if (!deletedRegion) {
        return res.status(404).json({ message: 'Region not found' })
      }

      res.status(200).json({ message: 'Region deleted successfully' })
    } catch (error) {
      console.error('Failed to delete region:', error)
      res.status(500).json({ message: 'Failed to delete region' })
    }
  },

  async getRegionsContainingPoint(req: Request, res: Response) {
    const { point } = req.query

    if (!point) {
      return res.status(400).json({ message: 'You must provide a point' })
    }

    const [longitude, latitude] = (point as string).split(',').map(parseFloat)

    try {
      const regions = await RegionModel.find({
        coordinates: {
          $elemMatch: {
            $eq: [longitude, latitude]
          }
        }
      }).lean()

      return res.status(200).json(regions)
    } catch (error) {
      console.error('Failed to fetch regions:', error)
      return res.status(500).json({ message: 'Failed to fetch regions' })
    }
  }
}
