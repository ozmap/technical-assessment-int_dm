import mongoose from "mongoose";

const env = {
  MONGO_URI:
    "mongodb+srv://admin:JpfKkqH2h82jZxLL@cluster0.7mn8fb9.mongodb.net/?retryWrites=true&w=majority",
};

const init = async function () {
  await mongoose.connect(env.MONGO_URI);
};

export default init();
