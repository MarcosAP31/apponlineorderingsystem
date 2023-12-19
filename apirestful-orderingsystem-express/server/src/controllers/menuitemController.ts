import { Request, Response } from 'express';
import pool from '../database';

class MenuItemController {
    
    public async list(req: Request, res: Response): Promise<void> {
        const menuitem = await pool.query('SELECT mi.ItemId,mi.CategoryId,mi.Name,mi.Description,mi.Price,mi.Image,menucategory.Name AS categoryName FROM `menuitem` AS mi JOIN menucategory ON menucategory.CategoryId=mi.CategoryId ORDER BY mi.CategoryId');
        res.json(menuitem);
    }
    
    public async listByCategoryId(req: Request, res: Response): Promise<any> {
        const { categoryid } = req.params;
        const menuitem = await pool.query('SELECT mi.ItemId,mi.CategoryId,mi.Name,mi.Description,mi.Price,mi.Image,menucategory.Name AS categoryName FROM `menuitem` AS mi JOIN menucategory ON menucategory.CategoryId=mi.CategoryId WHERE mi.CategoryId= ?',[categoryid]);
        res.json(menuitem);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const menuitem = await pool.query('SELECT mi.ItemId,mi.CategoryId,mi.Name,mi.Description,mi.Price,mi.Image,menucategory.Name AS categoryName FROM `menuitem` AS mi JOIN menucategory ON menucategory.CategoryId=mi.CategoryId WHERE ItemId = ?', [id]);
        console.log(menuitem.length);
        if (menuitem.length > 0) {
            return res.json(menuitem[0]);
        }
        res.status(404).json({ text: "The menuitem doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { Name } = req.body;
            
            // Check if a record with the same name already exists
            const existingMenuItem = await pool.query('SELECT * FROM menuitem WHERE Name = ?', [Name]);
            
            if (existingMenuItem.length > 0) {
                // If a record with the same name already exists, send an error response
                res.status(400).json({ message: 'MenuItem with the same name already exists' });
            } else {
                // If no record with the same name exists, proceed with the insertion
                const result = await pool.query('INSERT INTO menuitem SET ?', [req.body]);
                res.json({ message: 'MenuItem Saved' });
            }
        } catch (error) {
            // Handle any potential errors during the process
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        //const oldMenuItem = req.body;
        await pool.query('UPDATE menuitem set ? WHERE ItemId = ?', [req.body, id]);
        res.json({ message: "The menuitem was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM menuitem WHERE ItemId = ?', [id]);
        res.json({ message: "The menuitem was deleted" });
    }
    
   
}


const menuitemController = new MenuItemController;
export default menuitemController;