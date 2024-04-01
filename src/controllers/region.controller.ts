import express from 'express'
import {
  createRegion,
  getAllRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
  getRegionsContainingPoint
} from '../services/region.service'

export const regionRouter = express.Router()

regionRouter.get('/', async (req, res) => {
  try {
    const regions = await getAllRegions()
    res.status(200).json(regions)
  } catch (error) {
    console.error('Failed to fetch regions:', error)
    res.status(500).json({ message: 'Failed to fetch regions' })
  }
})

regionRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const region = await getRegionById(id)
    if (!region) {
      return res.status(404).json({ message: 'Region not found' })
    }
    res.status(200).json(region)
  } catch (error) {
    console.error('Failed to fetch region:', error)
    res.status(500).json({ message: 'Failed to fetch region' })
  }
})

regionRouter.post('/', async (req, res) => {
  try {
    const { name, coordinates, userId } = req.body
    const newRegion = await createRegion(name, coordinates, userId)
    res.status(201).json(newRegion)
  } catch (error) {
    console.error('Failed to create region:', error)
    res.status(500).json({ message: 'Failed to create region' })
  }
})

regionRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, coordinates } = req.body
    const updatedRegion = await updateRegion(id, name, coordinates)
    if (!updatedRegion) {
      return res.status(404).json({ message: 'Region not found' })
    }
    res.status(200).json(updatedRegion)
  } catch (error) {
    console.error('Failed to update region:', error)
    res.status(500).json({ message: 'Failed to update region' })
  }
})

regionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedRegion = await deleteRegion(id)
    if (!deletedRegion) {
      return res.status(404).json({ message: 'Region not found' })
    }
    res.status(200).json({ message: 'Region deleted successfully' })
  } catch (error) {
    console.error('Failed to delete region:', error)
    res.status(500).json({ message: 'Failed to delete region' })
  }
})

regionRouter.get('/contains', async (req, res) => {
  try {
    const { point } = req.query
    if (!point) {
      return res.status(400).json({ message: 'You must provide a point' })
    }
    const [longitude, latitude] = (point as string).split(',').map(parseFloat)
    const regions = await getRegionsContainingPoint(longitude, latitude)
    return res.status(200).json(regions)
  } catch (error) {
    console.error('Failed to fetch regions:', error)
    return res.status(500).json({ message: 'Failed to fetch regions' })
  }
})
