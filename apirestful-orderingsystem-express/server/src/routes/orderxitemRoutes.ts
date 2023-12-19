import express, { Router } from 'express';

import orderxitemController from '../controllers/orderxitemController';

class OrderXItemRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', orderxitemController.list);
        this.router.get('/:id', orderxitemController.getOne);
        this.router.get('/orderid/:id',orderxitemController.listByOrder);
        this.router.get('/totalprice/:id',orderxitemController.getTotalPriceByOrder);
        this.router.post('/', orderxitemController.create);
        this.router.put('/:id', orderxitemController.update);
        this.router.delete('/:id', orderxitemController.delete);
    }

}

export default new OrderXItemRoutes().router;

