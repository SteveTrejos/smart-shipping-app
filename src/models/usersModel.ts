import type { CreateShipmentDTO } from '../dto/shipments/createShipment.dto';
import type { CreateUserDTO } from '../dto/users/createUser.dto';
import type { UpdateUserDTO } from '../dto/users/updateUser.dto';
import type { UserPasswordUpdateDTO } from '../dto/users/userPasswordUpdate.dto';
import type { Shipment } from '../interfaces/shipmentInterface';
import {type User} from '../interfaces/userInterface';
import {sql} from 'bun';
import { ShipmentModel } from './shipmentsModel';

export class UserModel{
    static async createUser(user: CreateUserDTO): Promise<User> {
            const {password, ...noPasswordUser} = user;
            const emailExists = await this.getUserEmail(noPasswordUser?.email);
            if ( emailExists !== null ) throw new Error('Email already exists');
            const bcryptHash = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 10,
            });
            
            const newUser = {
                ...noPasswordUser,
                password: bcryptHash
            }
            const [userResult] = await sql`
            INSERT INTO users ${sql(newUser)} RETURNING *`;
            return userResult;
    }

    //method that validates the type passed as a parameter in the admin method "validateUserDetailsToChangePassword"
    static isUserDetailsValidation(obj: any): boolean{
        return (
            typeof obj === 'object' && 
            obj !== null &&
            typeof obj.name === 'string' && 
            typeof obj.last_name === 'string' &&
            typeof obj.phone === 'string' && 
            typeof obj.email === 'string' &&
            typeof obj.document_id === 'string'
        )
    }

    static async getUserByEmail(email: string): Promise<User | null>{
        const [user] = await sql`
            SELECT * FROM users WHERE email = ${email} AND user_status = 'A'
        `;
        return user || null;
    }

    static async getUserById(userId: number): Promise<User | null>{
        const [user] = await sql`
            SELECT * FROM users WHERE id = ${userId}
        `;
        return user || null;
    }

    static async updateUser(user: Partial<UpdateUserDTO>): Promise<boolean> {
        try {
            const {id, ...fieldsToUpdate} = user;
            if(!id) throw new Error('User id is required to update');

            const userIdExists = await this.getUserById(id);
            if (userIdExists === null) throw new Error(`User id doesn't exists. Can't update any register`);

            if(Object.keys(fieldsToUpdate).length === 0) throw new Error('No fields to update');

            const isUserUpdated = await sql`
                UPDATE users SET ${sql(fieldsToUpdate)} WHERE id = ${id} RETURNING *
            `;
            return isUserUpdated;
        } catch (err) {
            console.error(`Error updating the user ${err}`);
            return false;
        }
    }

    static async deleteUser(userId: number): Promise<boolean>{
        try{
            const userIdExists = await this.getUserById(userId);
            if (userIdExists === null) throw new Error(`User id doesn't exists. Can't update any register`);
            await sql`
                UPDATE users SET user_status = 'I' WHERE id = ${userId}
            `;
            return true;
        }catch(err){
            console.error(err);
            return false;
        }
    }

    static async updatePassword(user: UserPasswordUpdateDTO): Promise<boolean>{
        const {actualPassword, newPassword, id} = user;
        const isPasswordValid = this.validatePassword(newPassword);
        try{
            if(id){
                const userIdExists = await this.getUserById(id);
                if (userIdExists === null) throw new Error(`User id doesn't exists. Can't update any register`)
            }

            if(!isPasswordValid) throw new Error(`The length or new password type is not valid`);

            if (typeof newPassword !== 'string' || typeof actualPassword !== 'string' || actualPassword.length === 0) throw new Error(`Invalid parameters. ${JSON.stringify({isPasswordValid, actualPassword, newPassword})}`);

            const [userRegistered] = await sql`SELECT password FROM users WHERE id = ${id} `;
            const {password: registeredPassword} = userRegistered;

            if(!registeredPassword || userRegistered === undefined) throw new Error(`Couldn't get the password ${registeredPassword}`);

            const isMatch = await Bun.password.verify(actualPassword, registeredPassword );

            if(!isMatch) throw new Error(`Password don't match. ${typeof actualPassword} ${actualPassword} ${registeredPassword}`);

            const bcryptNewPassword = await Bun.password.hash(newPassword, {
                algorithm: 'bcrypt',
                cost: 10
            });
            const result = await sql`
                UPDATE users SET password = ${bcryptNewPassword} WHERE id = ${id} RETURNING *
            `;
            return result;
        }catch(err){
            console.error(`Error updating the password ${err}`);
            throw err;
        }
    }

    static validatePassword(password: string | undefined): boolean{
        if(password === undefined) return false;
        if( typeof password === 'string'){
            if(password.length < 8) return false;
            return true;
        }
        return false;
    }

    static async getAllUSers(limit: number, offset: number): Promise<User[]>{
        try{
            if(limit > 10 || limit < 1 || offset < 0){
                throw new Error('Invalid pagination parameters')
            }
            const result =  await sql`
            SELECT * FROM users ORDER BY id LIMIT ${limit} OFFSET ${offset}
            `;
            return result;
        }catch(err){
            if (err instanceof Error) {
                console.error(`Error getting users: ${err.message}`);   
                throw err;
            } else {
                throw new Error('An unknown error occurred while fetching users.');
            }
        }
    }

    static async getUserEmail(email: string): Promise<string | null>{
        if ( email === undefined || !email) throw new Error('Invalid parameters on function "validateRegisteredEmail"');

        const [result] = await sql`
            SELECT email FROM users WHERE email = ${email}
        `;
        if(!result) return null;
        return result.email;
    }

    static async getAllShipments(userId: number): Promise<Shipment[]>{
        if( !userId ) throw new Error('Invalid parameters on function "getAllShipments"');
        try{
            const result = await sql`SELECT * FROM shipments WHERE user_id = ${userId} AND shipment_status = 'A' AND EXISTS (SELECT 1 FROM users WHERE id = ${userId})`;
            return result;
        }catch(err){
            console.error(`Error getting all the shipments. ${err}`);
            throw err;
        }
    }

    static async getAllShipmentsByUserId(userId: number): Promise<Shipment[] | []>{
        if(!userId) throw new Error('Invalid parameters in function "getAllShipmentsByUserId"');
        try {
            const shipments = await sql`SELECT * FROM shipments WHERE user_id = ${userId}`;
            return shipments;
        }catch (err) {
            console.error(`Error getting all the user shipments. ${err }`);
            return [];
        }
    }

    static async getShipmentByTrackId(trackId: string): Promise<Shipment | null>{
        if(!trackId) throw new Error('Invalid parameters in function "getShipmentByTrackId"');
        try {
            const shipment = await ShipmentModel.getShipmentByTrackId(trackId);
            return shipment;
        }catch (err) {
            console.error(`Error getting the shipment from user. ${err }`);
            return null;
        }
    }

    static async getShipmentById(shipmentId: number): Promise<Shipment | null>{
        if(!shipmentId) throw new Error('Invalid parameters on function "getShipmentById"');
        try{
            const result = await ShipmentModel.getShipmentById(shipmentId);
            return result;
        }catch(err){
            console.error(`Error getting the shipment from user. ${err}`);
            return null;
        }
    }

    static async cancelShipmentById(shipmentId: number, userId: number): Promise<boolean>{
        if(!shipmentId || !userId) throw new Error('Invalid parameters on function "cancelShipmentById"');
        try{
            const shipment = await ShipmentModel.cancelShipmentById(shipmentId, userId);
            if(!shipment) return false;
            return true;
        }catch(err){
            console.error(`Error cancelling the shipment from user. ${err}`);
            throw err;
        }
    }

    static async createShipment(shipment: CreateShipmentDTO): Promise<Shipment | null>{
        if(!shipment) throw new Error('Invalid parameters on function "createShipment"');
        try{
            const newShipment = await ShipmentModel.createShipment(shipment);
            return newShipment || null;
        }catch(err){
            console.error(`Error creating the shipment from user. ${err}`);
            throw err;
        }
    }
}