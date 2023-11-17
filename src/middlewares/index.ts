import * as NodeGeocoder from 'node-geocoder'
import { STATUS } from '../controller.user/index'

const geocoderOptions = {
  provider: 'openstreetmap',
}

const geocoder = NodeGeocoder(geocoderOptions)

export const filterUser = async (req, res, next) => {
  const { address, coordinates } = req.body

  if ((address && coordinates) || (!address && !coordinates)) {
    return res.status(STATUS.BAD_REQUEST).json({ error: 'Informe apenas o endereço ou as coordenadas' })
  }

  try {
    if (address) {
      const data = await geocoder.geocode(address)
      if (data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({ error: 'Endereço não encontrado' })
      }

      const formattedAddress = `${data[0].streetName}, ${data[0].streetNumber}, ${
        data[0].neighborhood || data[0].extra?.neighborhood || ''
      }, ${data[0].zipcode}`

      req.body.coordinates = [data[0].latitude, data[0].longitude]
      req.body.address = formattedAddress
    } else {
      const [lat, lon] = coordinates as [number, number]
      const data = await geocoder.reverse({ lat, lon })
      if (data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({ error: 'Coordenadas não encontradas' })
      }

      const formattedAddress = `${data[0].streetName}, ${data[0].streetNumber}, ${
        data[0].neighborhood || data[0].extra?.neighborhood || ''
      }, ${data[0].zipcode}`

      req.body.address = formattedAddress
    }
    next()
  } catch (error) {
    console.error('Erro ao processar a requisição:', error)
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor' })
  }
}
