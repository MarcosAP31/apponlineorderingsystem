import { Request, Response } from 'express';
import pool from '../database';

class MenuCategoryController {
    
    public async list(req: Request, res: Response): Promise<void> {
        const menucategory = await pool.query('SELECT * FROM menucategory');
        res.json(menucategory);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const menucategory = await pool.query('SELECT * FROM menucategory WHERE CategoryId = ?', [id]);
        console.log(menucategory.length);
        if (menucategory.length > 0) {
            return res.json(menucategory[0]);
        }
        res.status(404).json({ text: "The menucategory doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { Name} = req.body;
            
            // Check if a record with the same name already exists
            const existingMenuCategory = await pool.query('SELECT * FROM menucategory WHERE Name = ?', [Name]);
            console.log(existingMenuCategory.length)
            if (existingMenuCategory.length > 0) {
                // If a record with the same name already exists, send an error response
                res.status(200).json({ message: 'MenuCategory with the same name already exists' });
            } else {
                // If no record with the same name exists, proceed with the insertion
                const result = await pool.query('INSERT INTO menucategory SET ?', [req.body]);
                res.json({ message: 'MenuCategory Saved' });
            }
        } catch (error) {
            // Handle any potential errors during the process
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        //const oldMenuCategory = req.body;
        await pool.query('UPDATE menucategory set ? WHERE CategoryId = ?', [req.body, id]);
        res.json({ message: "The menucategory was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM menucategory WHERE CategoryId = ?', [id]);
        res.json({ message: "The menucategory was deleted" });
    }
    
   
}


const menucategoryController = new MenuCategoryController;
export default menucategoryController;