const dotenv = require('dotenv');
dotenv.config();
const env = {
    PORT: process.env.PORT,
    DB_CONNECTION: process.env.DBConnection,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV,
};

const requiredVars = ['DB_CONNECTION', 'JWT_SECRET', 'CLIENT_URL'];
for (const key of requiredVars) {
    if (!env[key]) {
        throw new Error(`Required environment variable is missing: ${key}`);
    }
}

module.exports = env;
