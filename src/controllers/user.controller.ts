import express from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../services/user.service'

export const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  try {
    const users = await getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

userRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await getUserById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

userRouter.post('/', async (req, res) => {
  try {
    const { name, email, address, coordinates } = req.body
    const newUser = await createUser(name, email, address, coordinates)
    res.status(201).json(newUser)
  } catch (error) {
    console.error('Failed to create user:', error)
    res.status(500).json({ message: 'Failed to create user' })
  }
})

userRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, address, coordinates } = req.body
    const updatedUser = await updateUser(id, name, email, address, coordinates)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Failed to update user:', error)
    res.status(500).json({ message: 'Failed to update user' })
  }
})

userRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedUser = await deleteUser(id)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Failed to delete user:', error)
    res.status(500).json({ message: 'Failed to delete user' })
  }
})
