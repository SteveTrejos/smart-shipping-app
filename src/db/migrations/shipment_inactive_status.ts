import {sql} from 'bun';

await sql.begin(async tx => {
    await tx`INSERT INTO shipment_status(index, value) VALUES('I', 'Inactive')`;
})