import express, { request, response } from 'express';
import ClassesController from '../controllers/classesControllers/ClassesControlers';
import ConnectionsControllers from '../controllers/ConnectionsController/ConnectionsControllers';



const routes = express.Router();

const classesControllers = new ClassesController();
const connectionsControllers = new ConnectionsControllers();



routes.get('/list', classesControllers.index);
routes.post('/classes', classesControllers.create);

routes.post('/connections', connectionsControllers.create);
routes.get('/totalconnections', connectionsControllers.index);

export default routes;