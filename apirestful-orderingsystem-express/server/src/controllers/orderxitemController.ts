import { Request, Response } from 'express';


import pool from '../database';

class OrderXItemController {
    public async list(req: Request, res: Response): Promise<void> {
        const orderxitem = await pool.query('SELECT oi.OrderXItemId,oi.OrderId,oi.ItemId,oi.Quantity,oi.Subtotal,menuitem.Name AS itemName FROM `orderxitem` AS oi JOIN menuitem ON menuitem.ItemId=oi.ItemId');
        res.json(orderxitem);
    }
    public async listByOrder(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const orderxitem = await pool.query('SELECT oi.OrderXItemId,oi.OrderId,oi.ItemId,oi.Quantity,oi.Subtotal,menuitem.Name AS menuitemName,menuitem.Price AS menuitemPrice FROM `orderxitem` AS oi JOIN menuitem ON menuitem.ItemId=oi.ItemId WHERE OrderId = ?',[id]);
        res.json(orderxitem);
    }
    public async getTotalPriceByOrder(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const orderxitemResult = await pool.query('SELECT oi.OrderXItemId,oi.OrderId,oi.ItemId,oi.Quantity,oi.Subtotal,menuitem.Name AS menuitemName,menuitem.Price AS menuitemPrice FROM `orderxitem` AS oi JOIN menuitem ON menuitem.ItemId=oi.ItemId WHERE OrderId = ?',[id]);
    
            // Calculate total price
            let totalPrice = 0;
            for (const orderItem of orderxitemResult) {
                totalPrice += orderItem.menuitemPrice * orderItem.Quantity;
            }
    
            res.json(totalPrice);
        } catch (error) {
            console.error('Error calculating total price:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const orderxitem = await pool.query('SELECT oi.OrderXItemId,oi.OrderId,oi.ItemId,oi.Quantity,oi.Subtotal,menuitem.Name AS itemName FROM `orderxitem` AS oi JOIN menuitem ON menuitem.ItemId=oi.ItemId WHERE OrderXItemId = ?', [id]);
        console.log(orderxitem.length);
        if (orderxitem.length > 0) {
            return res.json(orderxitem[0]);
        }
        res.status(404).json({ text: "The order doesn't exits" });
    }
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const result = await pool.query('INSERT INTO `orderxitem` SET ?', [req.body]);
            // Obtén el ID del registro recién insertado
            const insertedId = result.insertId;
            res.json(insertedId);
        } catch (error) {
            console.error(error);
            res.status(500).json({ text: 'Error al crear el pedido' });
        }
    }
    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        //const oldOrder = req.body;
        await pool.query('UPDATE `orderxitem` set ? WHERE OrderXItemId = ?', [req.body, id]);
        res.json({ message: "The order was Updated" });
    }
    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM `orderxitem` WHERE OrderXItemId = ?', [id]);
        res.json({ message: "The order was deleted" });
    }
}
const orderxitemController = new OrderXItemController;
export default orderxitemController;