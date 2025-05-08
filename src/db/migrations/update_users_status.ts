import {sql} from 'bun';

const result = await sql`UPDATE users SET user_status = 'A' RETURNING *`;

console.log(`result ${JSON.stringify(result)}`);

