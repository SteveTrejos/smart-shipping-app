import {sql} from 'bun';

const result = await sql`SELECT * FROM shipments`;

console.log('shipments', result);