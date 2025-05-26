import {sql} from 'bun';

const result = await sql`SELECT * FROM shipments WHERE user_id = 1`;

console.log('shipments', result);