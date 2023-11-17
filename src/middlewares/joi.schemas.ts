import Joi = require('joi');

export const userSchema = Joi.object({
  name: Joi.string().label('name').required(),
  email: Joi.string().email().label('email').required(),
  address: Joi.object({
    street: Joi.string().required(),
    neighborhood: Joi.string().required(),
    number: Joi.number(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }).label('address'),
  coordinates: Joi.array().items(Joi.number(), Joi.number()).length(2).label('coordinates'),
})
  .oxor('address', 'coordinates')
  .messages({
    'any.required': 'É necessário o campo {{#label}}',
    'string.email': 'Formato de email inválido',
    'object.oxor': 'Informe apenas endereço ou coordenadas',
    'array.length': 'Informe coordenadas com latitude e longitude',
  });

export const regionSchema = Joi.object({
  name: Joi.string().label('name').required(),
  coordinates: Joi.array().items(Joi.number(), Joi.number()).length(2).label('coordinates').required(),
  user: Joi.string().label('user').required(),
}).messages({
  'any.required': 'É necessário o campo {{#label}}',
  'array.length': 'Informe coordenadas com latitude e longitude',
});
