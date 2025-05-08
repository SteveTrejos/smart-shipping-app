import {sql} from 'bun';

const result = await sql.begin(async tx => {
    return [

        await tx`DROP TABLE IF EXISTS users, statuses, shipments, couriers, shipment_courier`,
        
        await tx`DROP TYPE IF EXISTS userRole, statusName `,
        
        await await tx`
        SELECT conname AS constraint_name, conrelid::regclass AS table_name
        FROM pg_constraint WHERE conname = 'courier_status'
        ORDER BY table_name, constraint_name;
        `,
        ]
})
console.log(`result ${JSON.stringify(result[result.length-1])}`)