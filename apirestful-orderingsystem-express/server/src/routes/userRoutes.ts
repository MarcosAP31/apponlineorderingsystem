import express, { Router } from 'express';

import userController from '../controllers/userController';

class UserRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', userController.list);
        this.router.get('/:id', userController.getOne);
        this.router.post('/', userController.create);
        this.router.put('/:id', userController.update);
        this.router.delete('/:id', userController.delete);
        this.router.get('/email/:email',userController.getByEmail);
        this.router.get('/username/:username',userController.getByUsername);
        this.router.post('/login',userController.login)
    }

}

export default new UserRoutes().router;

