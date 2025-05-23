import {sql} from 'bun';

await sql.begin(async tx => {
    await tx`INSERT INTO vehicle_status(index, value) VALUES('A', 'Active')`;
    await tx`INSERT INTO vehicles(model, brand, type, license_plate, vehicle_status) VALUES
    (2022, 'Renault', 'T', 'WHK-111', 'A')`;
})