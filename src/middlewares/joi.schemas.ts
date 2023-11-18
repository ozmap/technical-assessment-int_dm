import Joi = require('joi');

export const userSchema = Joi.object({
  name: Joi.string().label('name').required(),
  email: Joi.string().email().label('email').required(),
  address: Joi.object({
    street: Joi.string().required(),
    neighborhood: Joi.string().required(),
    number: Joi.string(),
    zipCode: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }).label('address'),
  coordinates: Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
  }).label('coordinates'),
})
  .oxor('address', 'coordinates')
  .messages({
    'any.required': 'É necessário o campo {{#label}}',
    'string.email': 'Formato de email inválido',
    'object.oxor': 'Informe apenas endereço ou coordenadas',
    'object.base': '{{#label}} precisa ser um objeto',
  });

export const regionSchema = Joi.object({
  name: Joi.string().label('name').required(),
  coordinates: Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
  })
    .label('coordinates')
    .required(),
  user: Joi.string().label('user').required(),
}).messages({
  'any.required': 'É necessário o campo {{#label}}',
  'object.base': '{{#label}} precisa ser um objeto',
});
