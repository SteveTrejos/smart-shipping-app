import { sql } from "bun";

await sql.begin(async tx => {
    await tx`INSERT INTO vehicle_status(index, value) VALUES('I', 'Inactive')`;
})