import express, { Router } from 'express';

import menucategoryController from '../controllers/menucategoryController';

class MenuCategoryRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', menucategoryController.list);
        this.router.get('/:id', menucategoryController.getOne);
        this.router.post('/', menucategoryController.create);
        this.router.put('/:id', menucategoryController.update);
        this.router.delete('/:id', menucategoryController.delete);
        
        
    }

}

export default new MenuCategoryRoutes().router;

