import {sql} from 'bun';

const result = await sql`SELECT * FROM users`;

console.log(`result ${JSON.stringify(result)}`)