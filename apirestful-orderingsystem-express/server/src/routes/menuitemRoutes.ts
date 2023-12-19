import express, { Router } from 'express';

import menuitemController from '../controllers/menuitemController';

class MenuItemRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', menuitemController.list);
        this.router.get('/:id', menuitemController.getOne);
        this.router.get('/categoryid/:categoryid',menuitemController.listByCategoryId);
        this.router.post('/', menuitemController.create);
        this.router.put('/:id', menuitemController.update);
        this.router.delete('/:id', menuitemController.delete);
        
        
    }

}

export default new MenuItemRoutes().router;

