/**
 * config variables.
 */
export const config = {
    algorithms: ['HS256' as const],
    secret: 'mysecretkey@',
    HOST: "node_db",
    USER: "postgres",
    PASSWORD: "12345678",
    DB: "wallet-login",

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
