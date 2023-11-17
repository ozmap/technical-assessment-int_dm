import * as NodeGeocoder from 'node-geocoder'
import { STATUS } from '../controller.user/index'

const geocoderOptions = {
  provider: 'openstreetmap',
}

const geocoder = NodeGeocoder(geocoderOptions)

export const filterUser = async (req, res, next) => {
  const { addressUser, coordinatesUser } = req.body

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
      }, ${data[0].zipcode}`

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
      }, ${data[0].zipcode}`

      req.body.addressUser = formattedAddress
    }
    next()
  } catch (error) {
    console.error('Erro ao processar a requisição:', error)
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno do servidor' })
  }
}

// const createRegionsWithNewUser = async (id, req, res) => {
//   try {
//     const owner = id

//     const { nameRegion, coordinatesRegion }: RegionBodyTypes = req.body
//     console.log('Aqui no middleware', owner, nameRegion, coordinatesRegion)

//     if (!nameRegion || !coordinatesRegion || !owner) {
//       return res.status(STATUS.BAD_REQUEST).send({
//         message: 'Após criação do usuário, preencha  todos os campos corretamente para registrar a Região',
//       })
//     }

//     const existingRegion = await RegionModel.findOne({ coordinatesRegion }).lean()
//     if (existingRegion) {
//       return res.status(STATUS.BAD_REQUEST).send({
//         message: 'Região já cadastrada',
//       })
//     }

//     const region = await regionService.createService({
//       nameRegion,
//       owner,
//       coordinatesRegion,
//     })

//     if (!region) {
//       return res.status(STATUS.NOT_FOUND).send({ message: 'Após criado o Usuário, gerou Erro ao criar Região' })
//     }

//     return res.status(STATUS.CREATED).send({
//       menssage: 'Usuário e Região criados com sucesso!',
//       user: {
//         id: region._id,
//         nameRegion,
//         owner,
//         coordinatesRegion,
//       },
//     })
//   } catch (error) {
//     return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: error.message })
//   }
// }
