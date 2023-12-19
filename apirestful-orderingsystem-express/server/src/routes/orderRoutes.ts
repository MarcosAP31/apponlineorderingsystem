import express, { Router } from 'express';

import orderController from '../controllers/orderController';

class OrderRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', orderController.list);
        this.router.get('/delivered/', orderController.listOrderDelivered);
        this.router.get('/:id', orderController.getOne);
        this.router.post('/', orderController.create);
        this.router.put('/:id', orderController.update);
        this.router.delete('/:id', orderController.delete);
        
        
    }

}

export default new OrderRoutes().router;

