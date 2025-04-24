import { sql } from "bun";


const db = new sql({
    url: process.env.POSTGRES_URL,

    max: 20, // Maximum connections in pool
    idleTimeout: 30, // Close idle connections after 30s
    maxLifetime: 0, // Connection lifetime in seconds (0 = forever)
    connectionTimeout: 30, // Timeout when establishing new connections
  
    // SSL/TLS options
    tls: true,
    // tls: {
    //   rejectUnauthorized: true,
    //   requestCert: true,
    //   ca: "path/to/ca.pem",
    //   key: "path/to/key.pem",
    //   cert: "path/to/cert.pem",
    //   checkServerIdentity(hostname, cert) {
    //     ...
    //   },
    // },

    // Callbacks
  onconnect: client => {
    console.log("Connected to database");
  },
  onclose: client => {
    console.log("Connection closed");
  },
})


console.log(await sql`  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'`.execute(), 'tablas');
