import {sql} from 'bun';

const result = await sql`SELECT * FROM recovery_password_codes`;
console.log(result);