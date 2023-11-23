import NodeGeocoder from 'node-geocoder'
import { STATUS } from '../controller/controller.user'
import dotenv from 'dotenv'

dotenv.config()
const KEY_GOOGLE = process.env.API_KEY_GOOGLE

const geocoderOptions = {
  provider: 'google',
  apiKey: KEY_GOOGLE,
}

const geocoder = NodeGeocoder(geocoderOptions)

export const filterUser = async (req, res, next) => {
  const { addressUser, coordinatesUser } = req.body
  const id = req.params.id

  if (!id && addressUser && coordinatesUser) {
    return res.status(STATUS.BAD_REQUEST).json({ error: 'Informe apenas o endereço ou as coordenadas' })
  }

  if (!addressUser && !coordinatesUser && id) {
    return next()
  }

  if ((addressUser && coordinatesUser) || (!addressUser && !coordinatesUser)) {
    return res.status(STATUS.BAD_REQUEST).json({ error: 'Informe apenas o endereço ou as coordenadas' })
  }

  try {
    if (addressUser) {
      const data = await geocoder.geocode(addressUser)
      if (data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({ error: 'Endereço não encontrado' })
      }

      const formattedAddress = `${data[0].streetName}, ${data[0].streetNumber}, ${
        data[0].neighborhood || data[0].extra?.neighborhood || ''
      }, ${data[0].administrativeLevels.level2long || data[0].administrativeLevels.level2short || ''}, ${
        data[0].zipcode
      }`

      req.body.coordinatesUser = [data[0].latitude, data[0].longitude]
      req.body.addressUser = formattedAddress
    } else {
      const [lat, lon] = coordinatesUser as [number, number]
      const data = await geocoder.reverse({ lat, lon })
      if (data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({ error: 'Coordenadas não encontradas' })
      }

      const formattedAddress = `${data[0].streetName}, ${data[0].streetNumber}, ${
        data[0].neighborhood || data[0].extra?.neighborhood || ''
      }, ${data[0].administrativeLevels.level2long || data[0].administrativeLevels.level2short || ''}, ${
        data[0].zipcode
      }`

      req.body.addressUser = formattedAddress
    }
    next()
  } catch (error) {
    console.error('Erro ao processar a requisição no middleware:', error)
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor ao passar no middleware' })
  }
}
