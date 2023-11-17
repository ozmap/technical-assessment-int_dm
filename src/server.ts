import * as app from 'express';
import './db/database';
import errorMiddleware from './middlewares/error.middleware';
import usersRoute from './routes/users.route';
import regionsRoute from './routes/regions.route';

const PORT = process.env.API_PORT;

const server = app();

server.use(app.json());

server.use('/users', usersRoute);
server.use('/regions', regionsRoute);

server.use(errorMiddleware);

export default server.listen(PORT, () => console.log('Server listening on port', PORT));
