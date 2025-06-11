import {sql} from 'bun';

await sql`ALTER TABLE couriers DROP CONSTRAINT courier_status`