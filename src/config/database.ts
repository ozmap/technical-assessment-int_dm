import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const mongoURI = process.env.MONGO_URI

const initDatabase = async function () {
  try {
    await mongoose.connect(mongoURI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
  }
}

export default initDatabase
