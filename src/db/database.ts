import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const init = async function () {
  console.log('Connecting database');
  await mongoose.connect(MONGODB_URI);
  console.log('Database connected');
};

export default init();
