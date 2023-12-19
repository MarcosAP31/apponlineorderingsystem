import { Request, Response } from 'express';


import pool from '../database';

class OrderController {
    public async list(req: Request, res: Response): Promise<void> {
        const order = await pool.query('SELECT o.OrderId,o.UserId,o.OrderDate,o.TotalAmount,o.Status,o.PaymentStatus,user.Username AS username FROM `order` AS o JOIN user ON user.UserId=o.UserId');
        res.json(order);
    }
    public async listOrderDelivered(req: Request, res: Response): Promise<void> {
        const order = await pool.query('SELECT o.OrderId,o.UserId,o.OrderDate,o.TotalAmount,o.Status,o.PaymentStatus,user.Username AS username FROM `order` AS o JOIN user ON user.UserId=o.UserId WHERE order.Status LIKE "%Despachado%"');
        res.json(order);
    }
    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const order = await pool.query('SELECT o.OrderId,o.UserId,o.OrderDate,o.TotalAmount,o.Status,o.PaymentStatus,user.Username AS username FROM `order` AS o JOIN user ON user.UserId=o.UserId WHERE OrderId = ?', [id]);
        console.log(order.length);
        if (order.length > 0) {
            return res.json(order[0]);
        }
        res.status(404).json({ text: "The order doesn't exits" });
    }
    
    public async create(req: Request, res: Response): Promise<void> {
        try {
            // Extract order and order items from the request body
            const { order, orderItems } = req.body;
    
            // Check if order and order items are present in the request
            if (!order || !orderItems || !Array.isArray(orderItems)) {
                res.status(400).json({ text: 'Invalid request format' });
                return;
            }
    
            // Insert the order into the 'order' table
            const orderResult = await pool.query('INSERT INTO `order` SET ?', [order]);
    
            // Get the ID of the last inserted order
            const orderId = orderResult.insertId;
    
            // Insert order items into the 'orderxitem' table
            for (const item of orderItems) {
                await pool.query('INSERT INTO orderxitem (OrderId, ItemId, Quantity, Subtotal) VALUES (?, ?, ?, ?)',
                    [orderId, item.ItemId, item.Quantity, item.Subtotal]);
            }
    
            res.json({ orderId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ text: 'Error creating order and order items' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        //const oldOrder = req.body;
        await pool.query('UPDATE `order` set ? WHERE OrderId = ?', [req.body, id]);
        res.json({ message: "The order was Updated" });
    }
    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM `order` WHERE OrderId = ?', [id]);
        res.json({ message: "The order was deleted" });
    }
}
const orderController = new OrderController;
export default orderController;