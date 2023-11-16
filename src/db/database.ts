import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const init = async function () {
  console.log('Conectando ao banco');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado ao banco');
};

export default init();
