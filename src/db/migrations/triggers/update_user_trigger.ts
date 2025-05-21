import {sql} from 'bun';

await sql.begin(async tx => {
    await tx`
        CREATE OR REPLACE FUNCTION set_users_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;
    `;

    await tx`
        DROP TRIGGER IF EXISTS update_users ON users;
    `;

    await tx`
        CREATE TRIGGER update_users
        BEFORE UPDATE
        ON users
        FOR EACH ROW
        EXECUTE FUNCTION set_users_updated_at();
    `;
});