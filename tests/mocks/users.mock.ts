import { faker, fakerPT_BR } from '@faker-js/faker';
import regionsMock from './regions.mock';

const getAllUsersMock = {
  message: 'Usuários obtidos com sucesso',
  data: [
    {
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: fakerPT_BR.location.streetAddress(),
      coordinates: [faker.location.longitude(), faker.location.latitude()],
      regions: [faker.database.mongodbObjectId()],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      __v: faker.number.int(),
    },
  ],
  page: 1,
  limit: 10,
  total: 1,
};

const getAllUsersMock2 = {
  message: 'Não há nenhum usuário cadastrado neste intervalo',
  data: [],
  page: 1,
  limit: 10,
  total: 0,
};

const user = {
  _id: faker.database.mongodbObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: fakerPT_BR.location.streetAddress(),
  coordinates: [faker.location.longitude(), faker.location.latitude()],
  regions: [regionsMock.region],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  __v: faker.number.int(),
};

const users = {
  message: 'Usuários obtidos com sucesso',
  data: [user],
  page: 1,
  limit: 10,
  total: 1,
};

const userRequestBody = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  coordinates: {
    lng: faker.location.longitude(),
    lat: faker.location.latitude(),
  },
};

const userRequestBody2 = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: {
    street: fakerPT_BR.location.street(),
    number: fakerPT_BR.location.buildingNumber(),
    neighborhood: fakerPT_BR.lorem.slug(),
    city: fakerPT_BR.location.city(),
    state: fakerPT_BR.location.state(),
    zipCode: fakerPT_BR.location.zipCode(),
    country: fakerPT_BR.location.country(),
  },
};

const userRequestBody3 = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  address: {
    street: fakerPT_BR.location.street(),
    neighborhood: fakerPT_BR.lorem.slug(),
    city: fakerPT_BR.location.city(),
    state: fakerPT_BR.location.state(),
    zipCode: fakerPT_BR.location.zipCode(),
    country: fakerPT_BR.location.country(),
  },
};

export default {
  getAllUsersMock,
  getAllUsersMock2,
  users,
  user,
  userRequestBody,
  userRequestBody2,
  userRequestBody3,
};
