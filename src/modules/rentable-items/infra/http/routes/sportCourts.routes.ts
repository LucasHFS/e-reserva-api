import { Router } from 'express';

import SportCourtsController from '../controllers/SportCourtsController';

const sportCourtRouter = Router();

const sportCourtController = new SportCourtsController();

sportCourtRouter.get('/', sportCourtController.all);
sportCourtRouter.get('/:id', sportCourtController.findOne);
sportCourtRouter.post('/', sportCourtController.create);
sportCourtRouter.put('/:id', sportCourtController.update);
sportCourtRouter.delete('/:id', sportCourtController.delete);

export default sportCourtRouter;
