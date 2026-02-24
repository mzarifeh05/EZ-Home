const env = {
    PORT: process.env.PORT || 5000,
    DB_CONNECTION: process.env.DBConnection,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

const requiredVars = ['DB_CONNECTION', 'JWT_SECRET'];
for (const key of requiredVars) {
    if (!env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

module.exports = env;
