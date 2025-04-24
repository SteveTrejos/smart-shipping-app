import { sql } from 'bun';

await sql.begin(async tx => {

    //type userRole creation
    await tx`CREATE TYPE userRole AS ENUM('admin', 'customer', 'courier')`;

    //type statusName creation
    await tx`CREATE TYPE statusName AS ENUM('pending', 'in_transit', 'delivered', 'cancelled')`;

    //users table creation
    await tx`
    CREATE TABLE users(
        id SERIAL,
        name VARCHAR(60),
        email VARCHAR(80) UNIQUE,
        password VARCHAR(60),
        role userRole,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY(id)
    )`;

    //statuses table creation
    await tx`
        CREATE TABLE statuses(
            id SERIAL,
            name statusName,
            PRIMARY KEY(id)
        )
    `;

    //shipments table creation
    await tx`
        CREATE TABLE shipments(
            id SERIAL,
            tracking_number VARCHAR(30) UNIQUE,
            user_id INT,
            status_id INT,
            origin VARCHAR(120),
            destination VARCHAR(120),
            estimated_delivery TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            PRIMARY KEY(id),
            CONSTRAINT fk_shipments FOREIGN KEY(user_id) REFERENCES users(id),
            CONSTRAINT fk_statuses FOREIGN KEY(status_id) REFERENCES statuses(id) 
        )
    `;

    //couriers table creation
    await tx`
        CREATE TABLE couriers(
            id SERIAL,
            name VARCHAR(60),
            vehicle_number INT,
            available BOOLEAN,
            phone VARCHAR(10),
            PRIMARY KEY(id)
        )
    `;

    //shipment_courier table creation
    await tx`
        CREATE TABLE shipment_courier(
            id SERIAL,
            shipment_id INT,
            courier_id INT,
            assigned_at TIMESTAMP DEFAULT NOW(),
            PRIMARY KEY(id),
            CONSTRAINT fk_shipment_courier_shipments FOREIGN KEY(shipment_id) REFERENCES shipments(id),
            CONSTRAINT fk_shipment_courier_courier FOREIGN KEY(courier_id) REFERENCES couriers(id)
        )
    `;
});