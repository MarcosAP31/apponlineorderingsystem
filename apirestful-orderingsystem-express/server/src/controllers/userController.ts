import { Request, Response } from 'express';

const jwt=require("jsonwebtoken");
import pool from '../database';

var token=""
class UserController {
    
    public async list(req: Request, res: Response): Promise<void> {
        const users = await pool.query('SELECT * FROM user');
        res.json(users);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM user WHERE UserId = ?', [id]);
        console.log(user.length);
        if (user.length > 0) {
            return res.json(user[0]);
        }
        res.status(404).json({ text: "The user doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { Username } = req.body;
            const { Email }=req.body;
            // Check if a record with the same name already exists
            const existingUserByUsername = await pool.query('SELECT * FROM user WHERE Username = ?', [Username]);
            const existingUserByEmail= await pool.query('SELECT * FROM user WHERE Email = ?', [Email]);
            
            if (existingUserByUsername.length > 0||existingUserByEmail.length > 0) {
                // If a record with the same name already exists, send an error response
                res.status(400).json({ message: 'User with the same username or email already exists' });
            } else {
                // If no record with the same name exists, proceed with the insertion
                const result = await pool.query('INSERT INTO user SET ?', [req.body]);
                res.json({ message: 'User Saved' });
            }
        } catch (error) {
            // Handle any potential errors during the process
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        
        await pool.query('UPDATE user set ? WHERE UserId = ?', [req.body, id]);
        res.json({ message: "The user was Updated" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM user WHERE UserId = ?', [id]);
        res.json({ message: "The user was deleted" });
    }
    public async getByEmail(req: Request, res: Response): Promise<any> {
        const { email } = req.params;
        const user:any = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
        console.log(user.length);
        if (user.length > 0) {
            
            return res.json(user[0]);
        }
        
        res.status(404).json({ text: "The user doesn't exits" });
    }
    public async getByUsername(req: Request, res: Response): Promise<any> {
        const { Username } = req.params;
        const user:any = await pool.query('SELECT * FROM user WHERE Username = ?', [Username]);
        console.log(user.length);
        if (user.length > 0) {
            
            return res.json(user[0]);
        }else{
            return res.json(null);
        }
        
        res.status(404).json({ text: "The user doesn't exits" });
    }
    public async login(req: Request,res: Response): Promise<any> {
        const user2=req.body
        const user:any = await pool.query('SELECT * FROM user WHERE Email = ?', [user2.Email]);
        const user1:any=await pool.query('SELECT * FROM user WHERE Password = ?', [user2.Password]);
        console.log(user.length);
        if (user.length > 0 && user1.length>0) {
            if(user[0].Password==user1[0].Password){
                jwt.sign({user},'secretkey',((err:any,token:any)=>{
                    res.json(
                        token
                    );
                }));
            }
            //return res.json(user[0].Password);
            
        }else{
            res.json(null);
        }
        
        //res.status(404).json({ text: "The user doesn't exits" });
    }
    
    
    
}


const userController = new UserController;
export default userController;