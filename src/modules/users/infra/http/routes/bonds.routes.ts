import { Router } from 'express';

import BondsController from '../controllers/BondsController';

const bondsRouter = Router();

const bondsController = new BondsController();

bondsRouter.get('/', bondsController.all);
bondsRouter.get('/:id', bondsController.findOne);
bondsRouter.post('/', bondsController.create);
bondsRouter.put('/:id', bondsController.update);
bondsRouter.delete('/:id', bondsController.delete);

export default bondsRouter;
