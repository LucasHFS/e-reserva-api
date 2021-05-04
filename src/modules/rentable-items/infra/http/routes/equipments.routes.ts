import { Router } from 'express';

import EquipmentsController from '../controllers/EquipmentsController';

const equipmentRouter = Router();

const equipmentController = new EquipmentsController();

equipmentRouter.get('/', equipmentController.all);
equipmentRouter.get('/:id', equipmentController.findOne);
equipmentRouter.post('/', equipmentController.create);
equipmentRouter.put('/:id', equipmentController.update);
equipmentRouter.delete('/:id', equipmentController.delete);

export default equipmentRouter;
