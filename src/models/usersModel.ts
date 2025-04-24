import {type User} from '../interfaces/userInterface';
import {sql} from 'bun';

export class UserModel{
    static async registerUser(name: string, email: string, password: string, role = 'customer'): Promise<User> {
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
}