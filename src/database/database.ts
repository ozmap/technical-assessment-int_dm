import mongoose from "mongoose";

const init = () => {
  console.log("conectando...");

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Conetado"))
    .catch((error) => console.log("BD-->", error));
};

export default init;
