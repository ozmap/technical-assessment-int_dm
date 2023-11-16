import Joi = require('joi');

export const userSchema = Joi.object({
  name: Joi.string().label('name').required(),
  email: Joi.string().email().label('email').required(),
  address: Joi.string().label('address'),
  coordinates: Joi.array().items(Joi.number(), Joi.number()).label('coordinates'),
})
  .oxor('address', 'coordinates')
  .messages({
    'any.required': 'É necessário o campo {{#label}}',
    'string.email': 'Formato de email inválido',
    'object.oxor': 'Informe apenas endereço ou coordenadas',
  });
