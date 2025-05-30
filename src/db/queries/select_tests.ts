import {sql} from 'bun';

const result = await sql`SELECT * FROM admin WHERE id = ${10};`;
console.log(result);
