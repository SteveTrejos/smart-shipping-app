import {sql} from 'bun';

await sql`DROP TABLE IF EXISTS recovery_password_codes`;