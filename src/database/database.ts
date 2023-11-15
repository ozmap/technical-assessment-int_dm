import mongoose from "mongoose";

const init = () => {
  console.log("conectando...");

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Conetado"))
    .catch((error) => console.log("BD-->", error));
};

export default init;

// {import mongoose from "mongoose";
// const env = {
//   MONGO_URI:
//     "mongodb+srv://admin:<password>@cluster0.7mn8fb9.mongodb.net/?retryWrites=true&w=majority",
// };

// const init = async function () {
//   await mongoose.connect(env.MONGO_URI);
// };

// export default init()};
