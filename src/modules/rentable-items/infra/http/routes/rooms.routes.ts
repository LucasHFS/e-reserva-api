import { Router } from 'express';

import RoomsController from '../controllers/RoomsController';

const roomRouter = Router();

const roomController = new RoomsController();

roomRouter.get('/', roomController.all);
roomRouter.get('/:id', roomController.findOne);
roomRouter.post('/', roomController.create);
roomRouter.put('/:id', roomController.update);
roomRouter.delete('/:id', roomController.delete);

export default roomRouter;
