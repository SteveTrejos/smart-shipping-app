import {type User} from '../interfaces/userInterface';
import {sql} from 'bun';

export class UserModel{
    static async registerUser(name: string, email: string, password: string, role = 'customer'): Promise<User> {
        const emailExists = await this.validateRegisteredEmail(email);
        if ( !emailExists ) throw new Error('Email already exists');
        const bcryptHash = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 10,
          });

        const [user] = await sql`
            INSERT INTO users
            (name, email, password, role)
            VALUES(${name}, ${email}, ${bcryptHash}, ${role}) RETURNING *`;
        return user;
    }

    static async getUserByEmail(email: string): Promise<User | null>{
        const [user] = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        return user || null;
    }

    static async getUserById(userId: number): Promise<User | null>{
        const [user] = await sql`
            SELECT * FROM users WHERE id = ${userId}
        `;
        return user || null;
    }

    //TODO update the query for user to update just one field or multiple fields 
    static async updateUser(user: Partial<User>): Promise<boolean> {
        try {
            const {name, email, id} = user;
            if(id){
                const userIdExists = await this.getUserById(id);
                if (userIdExists === null) throw new Error(`User id doesn't exists. Can't update any register`)
            }
            await sql`
                UPDATE users SET name = ${name}, email = ${email} WHERE id = ${id}
            `;
            return true;
        } catch (err) {
            console.error(`Error updating the user ${err}`);
            return false;
        }
    }

    static async deleteUser(userId: number): Promise<boolean>{
        try{
            await sql`
                DELETE FROM users WHERE id = ${userId}
            `;
            return true;
        }catch(err){
            console.error(err);
            return false;
        }
    }

    static async updatePassword(user: Partial<User>): Promise<boolean | undefined>{
        const {password, id} = user;
        const isPasswordValid = this.validatePassword(password);
        try{
            if(id){
                const userIdExists = await this.getUserById(id);
                if (userIdExists === null) throw new Error(`User id doesn't exists. Can't update any register`)
            }

            if ( typeof password === 'string' && isPasswordValid ) {
                const bcryptNewPassword = await Bun.password.hash(password, {
                    algorithm: 'bcrypt',
                    cost: 10
                });
                await sql`
                    UPDATE users SET password = ${bcryptNewPassword} WHERE id = ${id}
                `;
                return true;
            }
        }catch(err){
            console.error(`Error updating the password ${err}`);
            return false;
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

    static async validateRegisteredEmail(email: string): Promise<boolean>{
        if ( email === undefined || !email) throw new Error('Invalid parameters on function "validateRegisteredEmail"');

        const result = await sql`
            SELECT email FROM users WHERE email = ${email}
        `;
        return result.length > 0;
    }
}