import express, { Req, Res } from 'express';
import mongoose from 'mongoose';
import database from './database';
import bodyParser from 'body-parser';

import { UserModel, RegionModel } from './models';
import GeoLib from './lib';

const app = express();
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

// Rotas CRUD para Usuários
app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, address, coordinates } = req.body;

    if ((address && coordinates) || (!address && !coordinates)) {
      return res.status(400).json({ error: 'Provide either address or coordinates, not both or none.' });
    }

    let userCoordinates;

    if (address) {
      userCoordinates = await GeoLib.getCoordinatesFromAddress(address);
    } else {
      userCoordinates = coordinates;
    }

    const user = await UserModel.create({
      name,
      email,
      address,
      coordinates: userCoordinates,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { address, coordinates } = req.body;

    if ((address && coordinates) || (!address && !coordinates)) {
      return res.status(400).json({ error: 'Provide either address or coordinates, not both or none.' });
    }

    let userCoordinates;

    if (address) {
      userCoordinates = await GeoLib.getCoordinatesFromAddress(address);
    } else {
      userCoordinates = coordinates;
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { address, coordinates: userCoordinates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rotas CRUD para Regiões
app.post('/regions', async (req: Request, res: Response) => {
  try {
    const { name, coordinates, userId } = req.body;

    const region = await RegionModel.create({
      name,
      coordinates,
      user: userId,
    });

    return res.status(201).json(region);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/regions/:lat/:lng', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.params;

    const regions = await RegionModel.find({
      coordinates: { $near: { $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } } },
    });

    return res.status(200).json(regions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/regions/:lat/:lng/:distance', async (req: Request, res: Response) => {
  try {
    const { lat, lng, distance } = req.params;

    const regions = await RegionModel.find({
      coordinates: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(distance),
        },
      },
    });

    return res.status(200).json(regions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});