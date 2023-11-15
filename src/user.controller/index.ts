import { UserModel } from "../models/models";
import userService from "../user.service";

const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 400,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  DEFAULT_ERROR: 418,
};

interface CreateRequestBody {
  name: string;
  email: string;
  address?: string;
  coordinates?: [number, number];
}

const create = async (req, res) => {
  const { name, email, address, coordinates }: CreateRequestBody = req.body;

  if (!name || !email || (!address && !coordinates)) {
    res
      .status(400)
      .send({ message: "Preencha todos os campos para efetuar o cadastro" });
  }

  const user = await userService.createService(req.body);

  if (!user) {
    return res.status(400).send({ message: "Erro ao criar usuário" });
  }

  res.status(201).send({
    menssage: "Usuário criado com sucesso!",
    user: {
      id: user._id,
      name,
      email,
      address,
      coordinates,
    },
  });
};

const findAll = async (req, res) => {
  const { page, limit } = req.query;

  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.count(),
  ]);

  return res.json({
    rows: users,
    page,
    limit,
    total,
  });
};

const findById = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Region not found" });
  }

  return user;
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, email, adress, coordinates } = req.body;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: "Region not found" });
  }

  await userService.updateService(id, name, email, adress, coordinates);

  return res.sendStatus(201);
};

export default { create, findAll, findById, update };
