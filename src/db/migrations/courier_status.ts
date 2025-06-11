import {sql} from 'bun';

await sql.begin(async tx => {
    await tx`INSERT INTO boolean_status(index, value) VALUES('A', 'Available')`;
    await tx`INSERT INTO boolean_status(index, value) VALUES('U', 'Unavailable')`;
});
