import {sql} from 'bun';

await sql.begin(async tx => {
    await tx`INSERT INTO shipment_status(index, value) VALUES('A', 'Active')`;
    await tx`INSERT INTO packaging_type(index, value) VALUES('B', 'Box')`;
})